import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { contestantSubmission } from '../mock';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { IContestant, ISubmission, IExam, ITask } from 'src/app/core/interfaces/core';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import * as _ from 'lodash';

export interface IContestantSubmission extends IContestant {
  taskName?: string;
  timeSubmitted?: string;
  score?: number;
}

@Component({
  selector: 'app-details-contestant',
  templateUrl: './details-contestant.component.html',
  styleUrls: ['./details-contestant.component.css']
})
export class DetailsContestantComponent {

  @Input() contestantId: number;
  @Input() exam: IExam;

  _contestant: IContestant;
  _submissions: ISubmission[];
  _tasks: ITask[];

  contestantDetails: IContestantSubmission[];
  constructor(
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase,
    private taskDatabase: TaskDatabase,
    private cd: ChangeDetectorRef
  ) { }

  async view() {
    this.contestantDetails = [];

    this._contestant = await this.contestantDatabase.getById(this.contestantId);
    this._submissions = await this.submissionDatabase.getByContestantId(this.contestantId);

    this._tasks = await this.taskDatabase.getByExamId(this.exam.id);

    _.forEach(this._submissions, (submission: ISubmission) => {
      let task = _.find(this._tasks, (task: ITask) => task.id == submission.taskId);
      const taskName = task.name;
      const timeSubmitted = task.timeSubmited;

      this.contestantDetails.push({
        ...this._contestant,
        taskName,
        timeSubmitted,
        score: +submission.score
      });
    });

  }

  refresh() {
    this.view().then(() => {
      this.cd.detectChanges();
    });
  }

}
