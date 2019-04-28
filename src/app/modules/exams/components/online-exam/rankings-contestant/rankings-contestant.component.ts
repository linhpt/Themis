import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { ISubmission, IExam } from 'src/app/core/interfaces/core';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import * as _ from 'lodash';
import { SpreadsheetService } from 'src/app/core/services/sheet-utils/spreadsheet.service';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { IContestantRank } from '../../../models/item.models';

export const SCHEMAS = ['rank', 'id', 'fullName', 'aliasName', 'joinDate', 'dob', 'score'];

@Component({
  selector: 'app-rankings-contestant',
  templateUrl: './rankings-contestant.component.html',
  styleUrls: ['./rankings-contestant.component.css']
})
export class RankingsContestantComponent implements OnInit {

  @Input() examId: number;
  @Output() contestant = new EventEmitter<number>();
  contestants: IContestantRank[] = [];
  exam: IExam;

  viewDetailContestant(contestantId: number) {
    this.contestant.emit(contestantId);
  }

  constructor(
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase,
    private examDatabase: ExamDatabase,
    private spreadsheetService: SpreadsheetService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.init().then((contestantRank: IContestantRank[]) => {
      this.updateRanking(contestantRank);
      this.cd.detectChanges();
    });
  }

  async init() {
    this.contestants.length = 0;
    this.exam = await this.examDatabase.getById(this.examId);
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

  refresh() {
    this.init().then((contestantRank: IContestantRank[]) => {
      this.updateRanking(contestantRank);
      this.cd.detectChanges();
    });

  }

  updateRanking(contestantRank: IContestantRank[]) {
    let values = [];
    _.forEach(contestantRank, (contestant: IContestantRank) => {
      values.push(_.at(contestant, SCHEMAS));
    });
    this.spreadsheetService.updateRankings(this.exam, values);
  }

}
