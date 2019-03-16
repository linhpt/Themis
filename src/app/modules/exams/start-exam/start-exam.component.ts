import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/core/services/task.service';
import { ContestantService } from 'src/app/core/services/contestant.service';
import { IExam, IContestant, ITask } from 'src/app/core/interfaces/core';
import * as _ from 'lodash';
import { SubmissionService } from 'src/app/core/services/submission.service';
import { SubmissionWatcher } from 'src/app/core/services/submission-watcher.service';
import { LogsWatcher } from 'src/app/core/services/logs-watcher.service';

@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.css']
})
export class StartExamComponent implements OnInit, OnDestroy {

  headers = ['#', 'First name', 'Last name', 'Join date'];
  rows = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private contestantService: ContestantService,
    private logsWatcher: LogsWatcher,
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

  ngOnDestroy(): void {
    this.submissionWatcher.unwatch();
    this.logsWatcher.unwatch();
  }
}
