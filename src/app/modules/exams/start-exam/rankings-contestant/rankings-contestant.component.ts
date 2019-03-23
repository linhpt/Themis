import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IContestantRank } from '../start-exam.component';
import { contestantsRank } from '../mock';

@Component({
  selector: 'app-rankings-contestant',
  templateUrl: './rankings-contestant.component.html',
  styleUrls: ['./rankings-contestant.component.css']
})
export class RankingsContestantComponent implements OnInit {
  
  @Output() contestant = new EventEmitter<number>();
  contestants: IContestantRank[] = contestantsRank;

  viewDetailContestant(contestantId: number) {
    this.contestant.emit(contestantId);
  }

  constructor() { }

  ngOnInit() {
  }

}
