import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IExam, IContestant, ISubmission, ITask, } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
const path = (<any>window).require('path');

const chokidar = (<any>window).require('chokidar');

import * as _ from 'lodash';
import { DetailsContestantComponent } from './details-contestant/details-contestant.component';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { RankingsContestantComponent } from './rankings-contestant/rankings-contestant.component';
import { SpreadsheetService } from 'src/app/core/services/sheet-utils/spreadsheet.service';
import { IContestantWithKey, PATTERNS, SPECIAL_CHARS, SUBMIT_SHEMA, ROOT, DRIVE, SUBMISSION } from '../../models/item.models';
import { DirectoryService } from '../../services/directory.service';
import { FileService } from '../../services/file.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'online-exam',
  templateUrl: './online-exam.component.html',
  styleUrls: ['./online-exam.component.css']
})
export class OnlineExamComponent implements OnInit, OnDestroy {

  @ViewChild(DetailsContestantComponent) detailContestant: DetailsContestantComponent;
  @ViewChild(RankingsContestantComponent) rankingsContestant: RankingsContestantComponent;
  exam: IExam = {};
  examId: number;

  private contestants: IContestantWithKey[];

  private driveEvent: any;
  private logsEvent: any;

  private driveDirectory: string;
  private submitDirectory: string;
  private logsDirectory: string;
  private rootDirectory: string;

  contestantId: number;
  showPanel: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private fileService: FileService,
    private directoryService: DirectoryService,
    private examDatabase: ExamDatabase,
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase,
    private taskDatabase: TaskDatabase,
    private spreadsheetService: SpreadsheetService
  ) {
    this.route.params.subscribe(async (params: Params) => {
      this.examId = +params['id'];
      this.contestantDatabase.getByExamId(this.examId).then((contestants: IContestant[]) => {
        this.contestants = _.map(contestants, (contestant: IContestant) => (<IContestantWithKey>{
          id: contestant.id,
          generateUUIDKey: contestant.generateUUIDKey
        }));
      });
      this.exam = await this.examDatabase.getById(this.examId);
    });
  }

  ngOnInit() {

    this.rootDirectory = localStorage.getItem(ROOT);
    this.driveDirectory = localStorage.getItem(DRIVE);

    this.submitDirectory = `${this.rootDirectory}\\${SUBMISSION}`
    this.logsDirectory = `${this.submitDirectory}\\Logs`;

    this.directoryService.emptyDirectory(this.driveDirectory);
    this.directoryService.emptyDirectory(this.submitDirectory);
    this.directoryService.emptyDirectory(this.logsDirectory);

    this.driveEvent = chokidar.watch(this.driveDirectory, { ignored: /(^|[\/\\])\../, persistent: true });
    this.driveEvent.on('add', (absolutePath: string) => {
      const tokens = path.normalize(absolutePath).split('\\');
      const fileName = tokens[tokens.length - 1];
      const [submitTime, privateKey, id, task, extension] = fileName.split(PATTERNS.FNAME_REGEX);
      const valid = _.some(this.contestants, (contestant: IContestant) => contestant.id == id && contestant.generateUUIDKey == privateKey);
      console.log('filename', fileName);
      if (valid) {
        const dataPath = `${this.submitDirectory}\\${submitTime}[${id}][${task}]${extension}`;
        this.fileService.move(absolutePath, dataPath);
      } else {
        this.fileService.remove(absolutePath, 'File name is invalid. Removed!');
      }
    });

    this.logsEvent = chokidar.watch(this.logsDirectory, { ignored: /(^|[\/\\])\../, persistent: true });
    this.logsEvent.on('add', (absolutePath: string) => {
      if (!this.fileService.temporary(absolutePath)) {
        this.fileService.read(absolutePath, (err: string, content: string) => {

          if (!err) {
            const [firstLine] = content.split(SPECIAL_CHARS.NEWLINE);
            const [aliasName, taskName, score] = firstLine.split(PATTERNS.COLONE_TRIANGLE_BULLET);
  
            this.taskDatabase.getByExamId(this.examId).then((tasks: ITask[]) => {

              if (tasks && tasks.length) {
                let task = _.find(tasks, (task: ITask) => task.name == taskName);

                if (task) {
                  this.contestantDatabase.getByExamId(this.examId).then((contestants: IContestant[]) => {
                    let contestant = _.find(contestants, (contestant: IContestant) => contestant.id == +aliasName.trim());

                    if (contestant) {

                      const submission = <ISubmission>{
                        contestantId: contestant.id,
                        examId: this.examId,
                        taskId: task.id,
                        score: score.trim(),
                        timeSubmission: (new Date).toString()
                      }
                      let submit = _.cloneDeep(submission);
                      this.submissionDatabase.add(submission).then((id: number) => {
                        submit.id = id;
                        submit.contestantName = contestant.aliasName;
                        submit.taskName = task.name;
                        submit.examName = this.exam.name;
              
                        this.spreadsheetService.appendNewSubmit(this.exam, _.at(submit, SUBMIT_SHEMA));
                        this.rankingsContestant.refresh();
                        if (this.showPanel) {
                          this.detailContestant.refresh();
                        }
  
                      });

                    } else {
                      console.log('error: cannot find contestant with aliasName', aliasName);
                    }

                  });
      
                } else {
                  console.log('error: cannot find contestant with aliasName', aliasName);
                }

              } else {
                console.log('error while retrieving tasks with examid', this.examId);
              }
              
            });

          } else {
            console.error('error while reading logs', err);
          }
          
        });
      }
    });
  }

  detailsContestant(contestantId: number) {
    if (this.showPanel) {
      if (this.contestantId == contestantId) {
        this.showPanel = false;
      } else {
        this.contestantId = contestantId;
      }

    } else {
      this.showPanel = true;
      this.contestantId = contestantId;
    }
    this.cd.detectChanges();
    this.detailContestant.view();
  }

  ngOnDestroy() {
    if (this.driveEvent ) {
      this.driveEvent.unwatch();
    } 
    if (this.logsEvent) {
      this.logsEvent.unwatch();
    }
  }

  back() {
    let message = {
      title: `Exam Confirmation`,
      message: `Are you sure you want to stop this exam ${this.exam.name}`
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = message;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((agree: boolean) => {
      if (agree) {
        this.back();
      }
    });
  }
}
