import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/core/services/task.service';
import { ContestantService } from 'src/app/core/services/contestant.service';
import { IExam, IContestant, ITask, ISubmission } from 'src/app/core/interfaces/core';
import * as _ from 'lodash';
import { SubmissionWatcher } from 'src/app/core/services/submission-watcher.service';
import { LogsWatcher } from 'src/app/core/services/logs-watcher.service';
import { FolderCreator } from 'src/app/core/services/folder-creator.service';
import { SpreadsheetUtils } from 'src/app/core/services/spreadsheet.service';
import { Location } from '@angular/common';
import { ExamService } from 'src/app/core/services/exam.service';
import { SubmissionService } from 'src/app/core/services/submission.service';

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
  taskNames: Array<string>;
  contestants: IContestant[] = [];
  contestantIds: Array<number>;
  headers = ['#', 'First Name', 'Last Name', 'Join Date'];
  scoreBoard: Array<Array<string>>;

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
    private spreadsheetUtils: SpreadsheetUtils,
    private submissionWatcher: SubmissionWatcher
  ) { }

  ngOnInit() {
    this.submissionWatcher.watch();
    this.logsWatcher.watch();
    this.route.params.subscribe((params: Params) => {
      const examId = +params['id'];
      this.examService.getById(examId).then((exams: IExam[]) => {
        this.exam = exams[0];
      });
      this.taskService.getByExamId(examId).then((tasks: IExam[]) => {
        this.contestantService.getByExamId(examId).then((contestants: IContestant[]) => {
          if (tasks && tasks.length
            && contestants
            && contestants.length) {
            this.tasks.push(...tasks);
            this.contestants.push(...contestants);

            this.taskNames = tasks.map((task: ITask) => task.name);
            this.contestantIds = contestants.map((contestant: IContestant) => +contestant.contestantId);

            this.folderCreator.createTasks(this.taskNames);
            this.folderCreator.createContestants(this.contestantIds);

            this.headers.push(...this.taskNames);
            this.spreadsheetUtils.headers = this.headers;
            this.spreadsheetUtils.updateSheet();

            this.scoreBoard = Array.from({ length: this.contestantIds.length }, (col, colIndex) => {
              return Array.from({ length: this.taskNames.length }, (row, rowIndex) => '-');
            });
          }
        });
      });
    });
  }

  ngAfterViewInit(): void {
    this.logsWatcher.successEvent.subscribe((result: IResult) => {
      let taskIndex = this.taskNames.indexOf(result.taskName);
      let contestantIndex = this.contestantIds.indexOf(result.contestantId);
      this.scoreBoard[contestantIndex][taskIndex] = result.content.substr(0, 10);
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.submissionWatcher.unwatch();
    this.logsWatcher.unwatch();
  }

  back() {
    this.location.back();
  }
}
