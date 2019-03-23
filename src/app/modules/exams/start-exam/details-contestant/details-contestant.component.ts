import { Component, OnInit, Input } from '@angular/core';
import { contestantSubmission } from '../mock';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { IContestant } from 'src/app/core/interfaces/core';

export interface IContestantSubmission extends IContestant {
  taskName?: string;
  examName?: string;
  score?: number;
}

@Component({
  selector: 'app-details-contestant',
  templateUrl: './details-contestant.component.html',
  styleUrls: ['./details-contestant.component.css']
})
export class DetailsContestantComponent implements OnInit {

  @Input() contestantId: number;

  contestantDetails: IContestantSubmission[] = contestantSubmission;
  constructor(
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase
  ) { }

  ngOnInit() {
  }

  view() {
  }

}
