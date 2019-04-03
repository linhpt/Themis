import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IExam, ITask, IContestant, DocType, ITest } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { GspreadUtils } from 'src/app/core/services/sheet-utils/gspread.service';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';

import * as _ from 'lodash';

const fs = (<any>window).require('fs');
const nodemailer = (<any>window).require("nodemailer");
const uuid = (<any>window).require('uuid/v1');

export const ROOT = 'root';
export const SUBMISSION = 'Submission';
export const THEMIS_CONTEST = 'ThemisContest';
export const DRIVE = 'drive';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  exam: IExam = {};
  tasks: ITask[] = [];
  contestants: IContestant[] = [];

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private gspread: GspreadUtils,
    private taskDatabase: TaskDatabase,
    private examDatabase: ExamDatabase,
    private contestantDatabase: ContestantDatabase
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      const id = +params['id'];
      this.exam = await this.examDatabase.getById(id);
      this.tasks = await this.taskDatabase.getByExamId(id);
      this.contestants = await this.contestantDatabase.getByExamId(id);
    });
  }

  remove(id: number, type: string) {

    let docType = DocType[type];
    let message = {
      title: `Delete ${type} Confirmation`,
      message: `Are you sure you want to delete ${type} ${id}?`
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = message;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) return;

      if (docType == DocType.CONTESTANT) {
        _.remove(this.contestants, (contestant: IContestant) => contestant.id == id);
        return this.contestantDatabase.remove(id);
      }

      if (docType == DocType.TASK) {
        _.remove(this.tasks, (task: ITask) => task.id == id);
        return this.taskDatabase.remove(id);
      }
    });
  }

  start() {

    const root = localStorage.getItem(ROOT);

    const submissionDir = `${root}\\${SUBMISSION}`;
    const themisDir = `${root}\\${THEMIS_CONTEST}`;

    this._createFolder(themisDir);
    this._createFolder(submissionDir);
    this._createFolder(`${submissionDir}\\Logs`);

    const examName = `${themisDir}\\${this.exam.name}`;
    const tasks = `${examName}\\Tasks`;
    const contestants = `${examName}\\Contestants`;

    this._createFolder(examName);
    this._createFolder(tasks);
    this._createFolder(contestants);

    _.forEach(this.tasks, (task: ITask) => {
      const taskName = `${tasks}\\${task.name}`;

      this._createFolder(taskName);
      _.forEach(task.tests, (test: ITest) => {
        const testName = `${taskName}\\${test.name}`;
        this._createFolder(testName);

        const input = `${testName}\\${task.name}.inp`;
        const output = `${testName}\\${task.name}.out`;

        this._createFile(input, test.input);
        this._createFile(output, test.output);
      });
    });

    _.forEach(this.contestants, (contestant: IContestant) => {
      this._createFolder(`${themisDir}\\${this.exam.name}\\Contestants\\${contestant.aliasName}`);
    });

    this._generateUUIDKeyForContestants().then(() => {
      this._sendMail();
      this.gspread.createSpreadsheet(this.exam, () => {
        this.router.navigate(['/exams/start-exam', this.exam.id]);
      });  
    });
  }

  private async _generateUUIDKeyForContestants() {
    _.forEach(this.contestants, (contestant: IContestant) => {
      contestant.generateUUIDKey = uuid();
    });

    await Promise.all(_.forEach(this.contestants, async (contestant: IContestant) => {
      await this.contestantDatabase.update(contestant.id, contestant);
    }));
  }

  private async _sendMail() {
    let mails = _.map(this.contestants, (contestant: IContestant) => contestant.email).join(', ');
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'int10041n3@gmail.com',
        pass: 'tinhoccoso'
      }
    });

    let mailOptions = {
      from: `'Themis administrator' <int10041n3@gmail.com>`,
      to: mails,
      subject: `Genearated key for submission mail`,
      text: `UUID generated key`,
      html: `<b></b>`
    };

    transporter.sendMail(mailOptions)
  }

  private _createFolder(folder: string) {
    if (!folder) return;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  }

  private _createFile(absolutePath: string, content: string) {
    fs.writeFile(absolutePath, content, (err: string) => {
      if (err) return console.log(err);
    });
  }

  back() {
    this.location.back();
  }
}
