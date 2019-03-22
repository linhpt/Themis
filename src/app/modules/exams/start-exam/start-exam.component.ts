import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IExam, IContestant, ITask, ISubmission } from 'src/app/core/interfaces/core';
import * as _ from 'lodash';
import { LogsWatcher } from 'src/app/core/services/folder-utils/logs-watcher.service';
import { Location } from '@angular/common';
import { contestantsMock, contestantDetailSubmission } from './mock';

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

  constructor(
    private route: ActivatedRoute,
    private logsWatcher: LogsWatcher,
    private cd: ChangeDetectorRef,
    private location: Location,
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  async updateLastStarted() {

  }

  back() {
    this.location.back();
  }
}
