import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { IContestantWithKey, PATTERNS, SPECIAL_CHARS, SUBMIT_SHEMA } from './item.models';

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

  private _contestants: IContestantWithKey[];

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
      this.contestantDatabase.getByExamId(this.examId).then((contestants: IContestant[]) => {
        this._contestants = _.map(contestants, (contestant: IContestant) => (<IContestantWithKey>{
          id: contestant.id,
          generateUUIDKey: contestant.generateUUIDKey
        }));
      });
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
    let res = this.checkValid(fileName);
    if (typeof res == 'boolean' && !res) {
      fs.unlink(absolutePath, () => {
        console.log('File name is invalid. Removed!');
      }); 
    } else if (typeof res == 'string') {
      const dataPath = `${this.submitDir}\\${res}`;
      fs.createReadStream(absolutePath).pipe(fs.createWriteStream(dataPath));  
    }
  }

  private checkValid(fileName: string) {
    console.log('fileName', fileName);
    let [submitTime, privateKey, id, task, extention] = fileName.split(PATTERNS.FNAME_REGEX);
    let valid = this.checkIdMatchUUID(+id, privateKey);
    if (valid) {
      return `${submitTime}[${id}][${task}]${extention}`;
    } else {
      return false;
    }
  }

  private checkIdMatchUUID(id: number, uuid: string) {
    return _.some(this._contestants, (contestant: IContestant) => contestant.id == id && contestant.generateUUIDKey == uuid);
  }

  private onCreateLogs = (absolutePath: string) => {
    if (_.last(absolutePath.split('.')) == 'tmp') return;
    fs.readFile(absolutePath, { encoding: 'utf-8' }, async (err: string, content: string) => {
      if (err) return console.error('error while reading logs', err);

      console.log('content', content);
      //Success reading logs
      const [firstLine] = content.split(SPECIAL_CHARS.NEWLINE);
      const [aliasName, taskName, score] = firstLine.split(PATTERNS.COLONE_TRIANGLE_BULLET);

      let now = new Date;

      let tasks = await this.taskDatabase.getByExamId(this.examId);
      if (!tasks || !tasks.length) return console.log('error: tasks is empty with examId', this.examId);

      let task = _.find(tasks, (task: ITask) => task.name == taskName);
      if (!task) return console.error('error: cannot find task with taskName', taskName);

      let contestants = await this.contestantDatabase.getByExamId(this.examId);
      let contestant = _.find(contestants, (contestant: IContestant) => contestant.id == +aliasName.trim());

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
      this.rankingsContestant.refresh();
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
