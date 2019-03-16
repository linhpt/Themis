import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/core/services/task.service';
import { ContestantService } from 'src/app/core/services/contestant.service';
import { IExam, IContestant, ITask } from 'src/app/core/interfaces/core';
import * as _ from 'lodash';
import { SubmissionWatcher } from 'src/app/core/services/submission-watcher.service';
import { LogsWatcher } from 'src/app/core/services/logs-watcher.service';
import { FolderCreator } from 'src/app/core/services/folder-creator.service';

export interface IResult {
  contestantId: string;
  taskName: string;
  content: string;
}

@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css']
})
export class StartExamComponent implements OnInit, OnDestroy, AfterViewInit {

  headers = ['#', 'First name', 'Last name', 'Join date'];
  rows = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private contestantService: ContestantService,
    private logsWatcher: LogsWatcher,
    private folderCreator: FolderCreator,
    private cd: ChangeDetectorRef,
    private submissionWatcher: SubmissionWatcher
  ) { }

  ngOnInit() {
    this.submissionWatcher.watch();
    this.logsWatcher.watch();
    this.route.params.subscribe((params: Params) => {
      const examId = +params['id'];
      this.taskService.getByExamId(examId).then((tasks: IExam[]) => {
        this.contestantService.getByExamId(examId).then((contestants: IContestant[]) => {
          if (tasks && tasks.length
            && contestants
            && contestants.length) {

            let taskNames = tasks.map((task: ITask) => task.name);
            let contestantIds = contestants.map((contestant: IContestant) => contestant.contestantId);

            this.folderCreator.createTasks(taskNames);
            this.folderCreator.createContestants(contestantIds);

            this.headers.push(...taskNames);
            for (var i = 0; i < contestants.length; i++) {
              let contestant = contestants[i];
              let row = [];
              row.push(contestant.contestantId);
              row.push(contestant.firstName);
              row.push(contestant.lastName);
              row.push(contestant.joinDate);

              _.times(taskNames.length, () => {
                row.push('-');
              });

              this.rows.push(row);
            }
          }
        });
      });
    });
  }

  ngAfterViewInit(): void {
    this.logsWatcher.successEvent.subscribe((result: IResult) => {
      const taskName = result.taskName;
      const contestantId = +result.contestantId;
      const content = result.content;
      let taskIndex = this.headers.indexOf(taskName);
      let row;
      for (var i = 0; i < this.rows.length; i++) {
        if (this.rows[i][0] == contestantId) {
          row = this.rows[i];
          break;
        }
      }
      row[taskIndex] = content.substr(0, 10);
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.submissionWatcher.unwatch();
    this.logsWatcher.unwatch();
  }
}
