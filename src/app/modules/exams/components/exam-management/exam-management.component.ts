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
import { IMailer, ROOT, SUBMISSION, THEMIS_CONTEST } from '../../models/item.models';
import { AlertDialogComponent } from 'src/app/core/alert-dialog/alert-dialog.component';

const uuid = (<any>window).require('uuid/v1');

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
    const rootDirectory = localStorage.getItem(ROOT);
    const submissionDirectory = `${rootDirectory}\\${SUBMISSION}`;
    const themisDirectory = `${rootDirectory}\\${THEMIS_CONTEST}`;

    this.directoryService.createDirectory(themisDirectory);
    this.directoryService.createDirectory(submissionDirectory);
    this.directoryService.createDirectory(`${submissionDirectory}\\Logs`);

    const examName = `${themisDirectory}\\${this.exam.name}`;
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
      this.directoryService.createDirectory(`${themisDirectory}\\${this.exam.name}\\Contestants\\${contestant.id}`);
    });

    this.generatePrivateKeyForContestants().then(() => {
      this.sendToAll();
      this.spreadsheetService.createSpreadsheet(this.exam, () => {
        this.router.navigate(['/exams/online-exam', this.exam.id]);
      });
    });

    this.exam.started = true;
    this.examDatabase.update(this.exam.id, this.exam);
  }

  async generatePrivateKeyForContestants() {
    _.forEach(this.contestants, (contestant: IContestant) => {
      contestant.generateUUIDKey = uuid();
    });

    await Promise.all(_.forEach(this.contestants, async (contestant: IContestant) => {
      await this.contestantDatabase.update(contestant.id, contestant);
    }));
  }

  async sendToAll() {
    await Promise.all(_.forEach(this.contestants, async (contestant: IContestant) => {
      await this.mailService.sendMail(<IMailer>{
        from: `'Themis administrator' <int10041n3@gmail.com>`,
        to: contestant.email,
        subject: `Genearated key for submission mail${(new Date).toString()}`,
        text: `UUID generated key`,
        html: `With exam ${this.exam.name}, Your private key for submit is <b>${contestant.generateUUIDKey}</b>`
      });
    }));
  }

  clone() {
    let cloneExam: IExam = _.cloneDeep(this.exam);
    cloneExam.name = cloneExam.name + `_Clone`;
    cloneExam.started = false;
    delete cloneExam.id;
    delete cloneExam.sheetId;

    this.examDatabase.add(cloneExam).then(async (id: number) => {

      _.forEach(this.originTasks, async (task: ITask) => {
        task.examId = id;
        delete task.id;
        await this.taskDatabase.add(task);
      });

      _.forEach(this.originContestants, async (contestant: IContestant) => {
        contestant.examId = id;
        delete contestant.id;
        await this.contestantDatabase.add(contestant);
      });

    })
      .then(() => {
        let message = {
          title: `Database information`,
          message: `Clone Exam Success!`
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = message;
        this.dialog.open(AlertDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => {
            this.back();
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
