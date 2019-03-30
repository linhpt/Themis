import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IExam, IContestant, ISubmission, ITask, } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { DRIVE, SUBMISSION, ROOT } from '../exam/exam.component';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const chokidar = (<any>window).require('chokidar');
const fsExtra = (<any>window).require('fs-extra');

import * as _ from 'lodash';
import { DetailsContestantComponent } from './details-contestant/details-contestant.component';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { RankingsContestantComponent } from './rankings-contestant/rankings-contestant.component';
import { GspreadUtils } from 'src/app/core/services/sheet-utils/gspread.service';

export const SPECIAL_CHARS = {
  TRIANGULAR_BULLET: 0x2023,
  NEWLINE: '\n',
  COLON: ':'
}

export const PATTERNS = {
  COLONE_TRIANGLE_BULLET: /:|‣/,
}

export interface IResult {
  contestantId: number;
  taskName: string;
  content: string;
}

export interface IContestantRank extends IContestant {
  rank?: number;
  score?: number;
}

export const SUBMIT_SHEMA = ['id', 'contestantName', 'taskName', 'examName', 'timeSubmission', 'score'];

@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css']
})
export class StartExamComponent implements OnInit, OnDestroy {

  @ViewChild(DetailsContestantComponent) detailContestant: DetailsContestantComponent;
  @ViewChild(RankingsContestantComponent) rankingsContestant: RankingsContestantComponent;
  exam: IExam = {};
  examId: number;

  private driveEvent: any;
  private logsEvent: any;
  private driveDir: string;
  private submitDir: string;
  private logsDir: string;
  private root: string;

  contestantId: number;
  showPanel: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cd: ChangeDetectorRef,
    private examDatabase: ExamDatabase,
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase,
    private taskDatabase: TaskDatabase,
    private gspread: GspreadUtils
  ) {
    this.route.params.subscribe(async (params: Params) => {
      this.examId = +params['id'];
      this.exam = await this.examDatabase.getById(this.examId);
    });
  }

  ngOnInit(): void {

    this.root = localStorage.getItem(ROOT);
    this.driveDir = localStorage.getItem(DRIVE);

    this.submitDir = `${this.root}\\${SUBMISSION}`
    this.logsDir = `${this.submitDir}\\Logs`;

    fsExtra.emptyDirSync(this.driveDir);
    fsExtra.emptyDirSync(this.submitDir);
    fsExtra.emptyDirSync(this.logsDir);

    this.driveEvent = chokidar.watch(this.driveDir, { ignored: /(^|[\/\\])\../, persistent: true });
    this.driveEvent.on('add', this.moveToSumission);

    this.logsEvent = chokidar.watch(this.logsDir, { ignored: /(^|[\/\\])\../, persistent: true });
    this.logsEvent.on('add', this.onCreateLogs);
  }

  private moveToSumission = (absolutePath: string) => {
    const tokens = path.normalize(absolutePath).split('\\');
    const fileName = tokens[tokens.length - 1];
    const dataPath = `${this.submitDir}\\${fileName}`;
    fs.createReadStream(absolutePath).pipe(fs.createWriteStream(dataPath));
  }

  private onCreateLogs = (absolutePath: string) => {
    if (_.last(absolutePath.split('.')) == 'tmp') return;
    fs.readFile(absolutePath, { encoding: 'utf-8' }, async (err: string, content: string) => {
      if (err) return console.error('error while reading logs', err);

      //Success reading logs
      const [firstLine] = content.split(SPECIAL_CHARS.NEWLINE);
      const [aliasName, taskName, score] = firstLine.split(PATTERNS.COLONE_TRIANGLE_BULLET);

      let now = new Date;

      let tasks = await this.taskDatabase.getByExamId(this.examId);
      if (!tasks || !tasks.length) return console.log('error: tasks is empty with examId', this.examId);

      let task = _.find(tasks, (task: ITask) => task.name == taskName);
      if (!task) return console.error('error: cannot find task with taskName', taskName);

      let contestants = await this.contestantDatabase.getByExamId(this.examId);
      let contestant = _.find(contestants, (contestant: IContestant) => contestant.aliasName == aliasName.trim());

      if (!contestant) return console.error('error: cannot find contestant with aliasName', aliasName);

      const submission = <ISubmission>{
        contestantId: contestant.id,
        examId: this.examId,
        taskId: task.id,
        score: score.trim(),
        timeSubmission: now.toString()
      }
      let submit = _.cloneDeep(submission);
      submit.id = await this.submissionDatabase.add(submission);
      submit.contestantName = contestant.aliasName;
      submit.taskName = task.name;
      submit.examName = this.exam.name;
  
      this.gspread.appendNewSubmit(this.exam, _.at(submit, SUBMIT_SHEMA));
      this.rankingsContestant.refesh();
      if (this.showPanel) {
        this.detailContestant.refresh();
      }
    });
  }

  detailsContestant(contestantId: number) {
    if (!this.showPanel) {
      this.showPanel = true;
      this.contestantId = contestantId;
    } else {
      if (this.contestantId == contestantId) {
        this.showPanel = false;
      } else {
        this.contestantId = contestantId;
      }

    }
    this.cd.detectChanges();
    this.detailContestant.view();
  }

  ngOnDestroy(): void {
    this.driveEvent.unwatch();
  }

  back() {
    this.location.back();
  }
}
