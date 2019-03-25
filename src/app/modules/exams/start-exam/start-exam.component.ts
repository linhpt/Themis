import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IExam, IContestant, } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { contestantsRank } from './mock';
import { SourceFolder, DestinationFolder } from '../exam/exam.component';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const chokidar = (<any>window).require('chokidar');
const fsExtra = (<any>window).require('fs-extra');

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

  private _folderWatcher: any;
  private _logsWatcher: any;
  private _submissionFolder: string;
  private _destinationFolder: string;
  private _logsFolder: string;

  detailContestantId: number;
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
    this._destinationFolder = localStorage.getItem(DestinationFolder);
    this._submissionFolder = localStorage.getItem(SourceFolder);
    this._logsFolder = `${localStorage.getItem(DestinationFolder)}\\Logs`;

    this._folderWatcher = chokidar.watch(this._submissionFolder, { ignored: /(^|[\/\\])\../, persistent: true });
    this._folderWatcher.on('add', this._onSubmit);

    this._logsWatcher = chokidar.watch(this._logsFolder, { ignored: /(^|[\/\\])\../, persistent: true });
    this._logsWatcher.on('add', this._onLogs);
  }

  private _onSubmit = (absolutePath: string) => {
    const tokens = path.normalize(absolutePath).split('\\');
    const fileName = tokens[tokens.length - 1];
    const dataPath = `${this._destinationFolder}\\${fileName}`;
    fs.createReadStream(absolutePath).pipe(fs.createWriteStream(dataPath));
  }

  private _onLogs = (absolutePath: string) => {
    if (_.last(absolutePath.split('.')) == 'tmp') return;

    let fileNameTokens = path.normalize(absolutePath).split('\\');
    let fileName = fileNameTokens[fileNameTokens.length - 1].replace(/\]|\[/g, ' ');
    let tokens = fileName.split(/\s+/);
  }

  contestantChange(contestantId: number) {
    if (!this.showPanel) {
      this.showPanel = true;
      this.detailContestantId = contestantId;
    } else {
      if (this.detailContestantId == contestantId) {
        this.showPanel = false;
      } else {
        this.detailContestantId = contestantId;
      }

    }
    this.cd.detectChanges();
    this.detailContestant.view();

  }

  ngOnDestroy(): void {
    this._folderWatcher.unwatch();
  }

  back() {
    this.location.back();
  }
}
