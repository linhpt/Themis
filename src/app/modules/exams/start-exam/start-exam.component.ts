import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/core/services/db-utils/task.service';
import { ContestantService } from 'src/app/core/services/db-utils/contestant.service';
import { IExam, IContestant, ITask, ISubmission } from 'src/app/core/interfaces/core';
import * as _ from 'lodash';
import { SubmissionWatcher } from 'src/app/core/services/folder-utils/submission-watcher.service';
import { LogsWatcher } from 'src/app/core/services/folder-utils/logs-watcher.service';
import { FolderCreator } from 'src/app/core/services/folder-utils/folder-creator.service';
import { Location } from '@angular/common';
import { ExamService } from 'src/app/core/services/db-utils/exam.service';
import { SubmissionService } from 'src/app/core/services/db-utils/submission.service';

export interface IResult {
  contestantId: number;
  taskName: string;
  content: string;
}

@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css']
})
export class StartExamComponent implements OnInit, OnDestroy, AfterViewInit {

  exam: IExam = {};
  tasks: ITask[] = [];
  taskIds: Array<number>;
  taskNames: Array<string>;
  contestants: IContestant[] = [];
  contestantIds: Array<number>;
  headers = ['Sdudent ID', 'Full Name', 'Alias Name', 'Join Date'];
  scoreBoard: Array<Array<string>> = [[]];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private contestantService: ContestantService,
    private logsWatcher: LogsWatcher,
    private folderCreator: FolderCreator,
    private cd: ChangeDetectorRef,
    private location: Location,
    private examService: ExamService,
    private submissionService: SubmissionService,
    private submissionWatcher: SubmissionWatcher
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
