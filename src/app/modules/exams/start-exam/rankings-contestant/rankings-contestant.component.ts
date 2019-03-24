import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IContestantRank } from '../start-exam.component';
import { contestantsRank } from '../mock';
import { IExam, ISubmission } from 'src/app/core/interfaces/core';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-rankings-contestant',
  templateUrl: './rankings-contestant.component.html',
  styleUrls: ['./rankings-contestant.component.css']
})
export class RankingsContestantComponent {

  @Input() exam: IExam;
  @Output() contestant = new EventEmitter<number>();
  contestants: IContestantRank[] = contestantsRank;

  viewDetailContestant(contestantId: number) {
    this.contestant.emit(contestantId);
  }

  constructor(
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase,
  ) {
    this.init();
  }

  async init() {
    this.contestants = await this.contestantDatabase.getByExamId(this.exam.id);
    _.forEach(this.contestants, async (contestant: IContestantRank) => {
      let submissionByContestant = await this.submissionDatabase.getByContestantId(contestant.id);
      contestant.score = 0;
      const submissions = _.filter(submissionByContestant, (submission: ISubmission) => submission.examId == this.exam.id);
      _.forEach(submissions, (submission: ISubmission) => {
        contestant.score += +submission.score;
      });

    });

    this.contestants = _.sortBy(this.contestants, [(contestant: IContestantRank) => contestant.score]);
    _.forEach(this.contestants, (contestant: IContestantRank, index: number) => {
      contestant.rank = index;
    });

  }

}
