import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IExam, ITask, IContestant, DocType, ITest } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { SpreadsheetService } from 'src/app/core/services/sheet-utils/spreadsheet.service';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';

import * as _ from 'lodash';
import { DirectoryService } from '../../services/directory.service';
import { MailService } from '../../services/mail.service';
import { IMailer } from '../../models/item.models';

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
    private spreadsheetService: SpreadsheetService,
    private taskDatabase: TaskDatabase,
    private examDatabase: ExamDatabase,
    private directoryService: DirectoryService,
    private mailService: MailService,
    private contestantDatabase: ContestantDatabase
  ) {
    this.exam.started = true;
  }

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

  removeContestant(id: number) {
    let message = {
      title: `Delete Contestant Confirmation`,
      message: `Are you sure you want to delete Contestant ${id}?`
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = message;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((agree: boolean) => {
      if (agree) {
        this.contestantDatabase.remove(id).then(() => {
          _.remove(this.contestants, (contestant: IContestant) => contestant.id == id);
        });
      }
    });
  }

  removeTask(id: number) {
    let message = {
      title: `Delete Task Confirmation`,
      message: `Are you sure you want to delete Task ${id}?`
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = message;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((agree: boolean) => {
      if (agree) {        
        this.taskDatabase.remove(id).then(() => {
          _.remove(this.tasks, (task: ITask) => task.id == id);
        });
      }
    });
  }

  start() {
    const root = localStorage.getItem(ROOT);
    const submissionDir = `${root}\\${SUBMISSION}`;
    const themisDir = `${root}\\${THEMIS_CONTEST}`;

    this.directoryService.createDirectory(themisDir);
    this.directoryService.createDirectory(submissionDir);
    this.directoryService.createDirectory(`${submissionDir}\\Logs`);

    const examName = `${themisDir}\\${this.exam.name}`;
    const tasks = `${examName}\\Tasks`;
    const contestants = `${examName}\\Contestants`;

    this.directoryService.createDirectory(examName);
    this.directoryService.createDirectory(tasks);
    this.directoryService.createDirectory(contestants);

    _.forEach(this.tasks, (task: ITask) => {
      const taskName = `${tasks}\\${task.name}`;
      this.directoryService.createDirectory(taskName);

      _.forEach(task.tests, (test: ITest) => {
        const testName = `${taskName}\\${test.name}`;
        this.directoryService.createDirectory(testName);
        const input = `${testName}\\${task.name}.inp`;
        const output = `${testName}\\${task.name}.out`;
        this.directoryService.createFile(input, test.input);
        this.directoryService.createFile(output, test.output);
      });
    });

    _.forEach(this.contestants, (contestant: IContestant) => {
      this.directoryService.createDirectory(`${themisDir}\\${this.exam.name}\\Contestants\\${contestant.id}`);
    });

    this.generateUUIDKeyForContestants().then(() => {
      this.sendToAll();
      this.spreadsheetService.createSpreadsheet(this.exam, () => {
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

  async sendToAll() {
    _.forEach(this.contestants, (contestant: IContestant) => {
      this.mailService.sendMail(<IMailer>{
        from: `'Themis administrator' <int10041n3@gmail.com>`,
        to: contestant.email,
        subject: `Genearated key for submission mail${(new Date).toString()}`,
        text: `UUID generated key`,
        html: `With exam ${contestant.examId}, Your private key for submit is <b>${contestant.generateUUIDKey}</b>`
      });
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
