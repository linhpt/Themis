import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { IContestantRank } from '../start-exam.component';
import { ISubmission, IExam } from 'src/app/core/interfaces/core';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import * as _ from 'lodash';
import { GspreadUtils } from 'src/app/core/services/sheet-utils/gspread.service';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';

@Component({
  selector: 'app-rankings-contestant',
  templateUrl: './rankings-contestant.component.html',
  styleUrls: ['./rankings-contestant.component.css']
})
export class RankingsContestantComponent implements OnInit {

  @Input() examId: number;
  @Output() contestant = new EventEmitter<number>();
  contestants: IContestantRank[] = [];
  _exam: IExam;

  viewDetailContestant(contestantId: number) {
    this.contestant.emit(contestantId);
  }

  constructor(
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase,
    private examDatabase: ExamDatabase,
    private gspread: GspreadUtils,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.init().then((contestantRank: IContestantRank[]) => {
      let values = [];
      _.forEach(contestantRank, (contestant: IContestantRank) => {
        values.push(_.values(contestant));
      });

      this.gspread.updateRankings(this._exam, values, () => { });
      this.cd.detectChanges();
    });
  }

  async init() {
    this.contestants.length = 0;
    this._exam = await this.examDatabase.getById(this.examId);
    this.contestants.push(...<IContestantRank[]>await this.contestantDatabase.getByExamId(this.examId));

    if (!this.contestants || !this.contestants.length) console.error('error: contestants empty with examId', this.examId);

    let allSubmit = await this.submissionDatabase.getAll();

    _.forEach(this.contestants, (contestant: IContestantRank) => {

      let submitByContestant = _.filter(allSubmit, (submit: ISubmission) => submit.contestantId == contestant.id && submit.examId == this.examId);
      contestant.score = 0;
      _.forEach(submitByContestant, (submission: ISubmission) => {
        contestant.score += +submission.score;
      });

    });

    this.contestants = _.orderBy(this.contestants, ['score'], ['desc']);

    _.forEach(this.contestants, (contestant: IContestantRank, index: number) => {
      contestant.rank = index + 1;
    });
    
    return this.contestants;

  }

  refesh() {

    this.init().then(() => {
      this.cd.detectChanges();
    });

  }

}
