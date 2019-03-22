import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IExam, IContestant, } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { contestantsMock, contestantDetailSubmission } from './mock';
import { SourceFolder, DestinationFolder } from '../exam/exam.component';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const fsExtra = (<any>window).require('fs-extra');

export interface IResult {
  contestantId: number;
  taskName: string;
  content: string;
}

export interface IContestantWithScore extends IContestant {
  score?: number;
}

export interface IContestantSubmit extends IContestantWithScore {
  taskName?: string;
  examName?: string;
}

@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css']
})
export class StartExamComponent implements OnInit, OnDestroy, AfterViewInit {

  exam: IExam = {};
  contestants: IContestantWithScore[] = contestantsMock;
  contestantDetails: IContestantSubmit[] = contestantDetailSubmission;
  private _folderWatcher: any;
  private _submissionFolder: string;
  private _destinationFolder: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private examDatabase: ExamDatabase
  ) { }

  ngOnInit(): void {
    this._destinationFolder = localStorage.getItem(DestinationFolder);
    this._submissionFolder = localStorage.getItem(SourceFolder);
    this._folderWatcher = chokidar.watch(this._submissionFolder, { ignored: /(^|[\/\\])\../, persistent: true });
    this._folderWatcher.on('add', (absolutePath: string) => {
      const tokens = path.normalize(absolutePath).split('\\');
      const fileName = tokens[tokens.length - 1];
      const dataPath = `${this._destinationFolder}\\${fileName}`;
      fs.createReadStream(absolutePath).pipe(fs.createWriteStream(dataPath));
    });
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.examDatabase.getById(id).then((exam: IExam) => {
        this.exam = exam;
      });
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this._folderWatcher.unwatch();
  }

  back() {
    this.location.back();
  }
}
