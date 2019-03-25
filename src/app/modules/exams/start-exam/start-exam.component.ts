import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IExam, IContestant, } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { DRIVE, SUBMISSION} from '../exam/exam.component';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const chokidar = (<any>window).require('chokidar');

import * as _ from 'lodash';
import { DetailsContestantComponent } from './details-contestant/details-contestant.component';

export interface IResult {
  contestantId: number;
  taskName: string;
  content: string;
}

export interface IContestantRank extends IContestant {
  rank?: number;
  score?: number;
}
@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css']
})
export class StartExamComponent implements OnInit, OnDestroy {

  @ViewChild(DetailsContestantComponent) detailContestant: DetailsContestantComponent;
  exam: IExam = {};
  examId: number;

  private driveEventListener: any;
  private logsEventListener: any;
  private driveDir: string;
  private submitDir: string;
  private logsDir: string;

  contestantId: number;
  showPanel: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cd: ChangeDetectorRef,
    private examDatabase: ExamDatabase
  ) {
    this.route.params.subscribe(async (params: Params) => {
      this.examId = +params['id'];
      this.exam = await this.examDatabase.getById(this.examId);
    });
  }

  ngOnInit(): void {
    this.driveDir = localStorage.getItem(DRIVE);

    this.submitDir = localStorage.getItem(SUBMISSION);
    this.logsDir = `${localStorage.getItem(SUBMISSION)}\\Logs`;

    this.driveEventListener = chokidar.watch(this.driveDir, { ignored: /(^|[\/\\])\../, persistent: true });
    this.driveEventListener.on('add', this.onSync);

    this.logsEventListener = chokidar.watch(this.logsDir, { ignored: /(^|[\/\\])\../, persistent: true });
    this.logsEventListener.on('add', this.onCreateLogs);
  }

  private onSync = (absolutePath: string) => {
    const tokens = path.normalize(absolutePath).split('\\');
    const fileName = tokens[tokens.length - 1];
    const dataPath = `${this.submitDir}\\${fileName}`;
    fs.createReadStream(absolutePath).pipe(fs.createWriteStream(dataPath));
  }

  private onCreateLogs = (absolutePath: string) => {
    if (_.last(absolutePath.split('.')) == 'tmp') return;

    let fileNameTokens = path.normalize(absolutePath).split('\\');
    let fileName = fileNameTokens[fileNameTokens.length - 1].replace(/\]|\[/g, ' ');
    let tokens = fileName.split(/\s+/);
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
    this.driveEventListener.unwatch();
  }

  back() {
    this.location.back();
  }
}
