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
  selector: 'app-exam-management',
  templateUrl: './exam-management.component.html',
  styleUrls: ['./exam-management.component.css']
})
export class ExamManagementComponent implements OnInit {

  exam: IExam = {};
  tasks: ITask[] = [];
  contestants: IContestant[] = [];
  private originContestants: IContestant[] = [];
  private originTasks: ITask[] = [];

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
      const id = Number(params['id']);
      this.exam = await this.examDatabase.getById(id);
      this.tasks = await this.taskDatabase.getByExamId(id);
      this.contestants = await this.contestantDatabase.getByExamId(id);
      this.originContestants = _.cloneDeep(this.contestants);
      this.originTasks = _.cloneDeep(this.tasks);
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

    this.createFolder(themisDir);
    this.createFolder(submissionDir);
    this.createFolder(`${submissionDir}\\Logs`);

    const examName = `${themisDir}\\${this.exam.name}`;
    const tasks = `${examName}\\Tasks`;
    const contestants = `${examName}\\Contestants`;

    this.createFolder(examName);
    this.createFolder(tasks);
    this.createFolder(contestants);

    _.forEach(this.tasks, (task: ITask) => {
      const taskName = `${tasks}\\${task.name}`;

      this.createFolder(taskName);
      _.forEach(task.tests, (test: ITest) => {
        const testName = `${taskName}\\${test.name}`;
        this.createFolder(testName);

        const input = `${testName}\\${task.name}.inp`;
        const output = `${testName}\\${task.name}.out`;

        this.createFile(input, test.input);
        this.createFile(output, test.output);
      });
    });

    _.forEach(this.contestants, (contestant: IContestant) => {
      this.createFolder(`${themisDir}\\${this.exam.name}\\Contestants\\${contestant.id}`);
    });

    this.generateUUIDKeyForContestants().then(() => {
      this.sendMail();
      this.gspread.createSpreadsheet(this.exam, () => {
        this.router.navigate(['/exams/online-exam', this.exam.id]);
      });  
    });

    this.exam.started = true;
    this.examDatabase.update(this.exam.id, this.exam);
  }

  async generateUUIDKeyForContestants() {
    _.forEach(this.contestants, (contestant: IContestant) => {
      contestant.generateUUIDKey = uuid();
    });

    await Promise.all(_.forEach(this.contestants, async (contestant: IContestant) => {
      await this.contestantDatabase.update(contestant.id, contestant);
    }));
  }

  async sendMail() {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'int10041n3@gmail.com',
        pass: 'tinhoccoso'
      }
    });

    let now = new Date;
    _.forEach(this.contestants, (contestant: IContestant) => {
      transporter.sendMail({
        from: `'Themis administrator' <int10041n3@gmail.com>`,
        to: contestant.email,
        subject: `Genearated key for submission mail${now.toString()}`,
        text: `UUID generated key`,
        html: `<b>${contestant.generateUUIDKey}</b>`
      })
    });
  }

  createFolder(folder: string) {
    if (!folder) return;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  }

  createFile(absolutePath: string, content: string) {
    fs.writeFile(absolutePath, content, (err: string) => {
      if (err) return console.log(err);
    });
  }

  searchContestant(name: string) {
    this.contestants = _.filter(this.originContestants, (contestant: IContestant) => {
      return _.lowerCase(contestant.aliasName).indexOf(_.lowerCase(name)) > -1 || 
              _.lowerCase(contestant.fullName).indexOf(_.lowerCase(name)) > -1;
    });
  }

  resetContestant() {
    this.contestants = _.cloneDeep(this.originContestants);
  }

  searchTask(name: string) {
    this.tasks = _.filter(this.originTasks, (task: ITask) => {
      return _.lowerCase(task.name).indexOf(_.lowerCase(name)) > -1;
    });
  }

  resetTask() {
    this.tasks = _.cloneDeep(this.originTasks);
  }

  back() {
    this.location.back();
  }
}
