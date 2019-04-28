import { Component, OnInit, Input } from '@angular/core';
import { IContestant, IExam } from 'src/app/core/interfaces/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { Location } from '@angular/common';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';

@Component({
  selector: 'app-contestant',
  templateUrl: './contestant.component.html',
  styleUrls: ['./contestant.component.css']
})
export class ContestantComponent implements OnInit {

  @Input() action: string;
  examStarted = false;
  editMode = false;
  contestant: IContestant = {};

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private examDatabase: ExamDatabase,
    private contestantDatabase: ContestantDatabase
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      if (this.action == 'create') {
        this.contestant.examId = id;
      }
      if (this.action == 'edit') {
        this.contestantDatabase.getById(id).then((contestant: IContestant) => {
          this.contestant = contestant;
          this.examDatabase.getById(contestant.examId).then((exam: IExam) => {
            this.examStarted = exam.started;
          });
        });  
      }
    });
  }

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.contestant.joinDate = now.toString();
      this.contestantDatabase.add(this.contestant);
    } else if (this.action == 'edit') {
      this.contestantDatabase.update(this.contestant.id, this.contestant);
    }
    this.back();
  }

  edit() {
    this.editMode = true;
  }

  back() {
    this.location.back();
  }
}
