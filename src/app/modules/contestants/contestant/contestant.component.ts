import { Component, OnInit, Input } from '@angular/core';
import { IContestant, IExam } from 'src/app/core/interfaces/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { Location } from '@angular/common';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import * as _ from 'lodash';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AlertDialogComponent } from 'src/app/core/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-contestant',
  templateUrl: './contestant.component.html',
  styleUrls: ['./contestant.component.css']
})
export class ContestantComponent implements OnInit {

  @Input() action: string;
  examStarted = true;
  editMode = false;
  contestant: IContestant = {};
  contestants: IContestant[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private examDatabase: ExamDatabase,
    private dialog: MatDialog,
    private contestantDatabase: ContestantDatabase
  ) {
    
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      if (this.action == 'create') {
        this.contestant.examId = id;
        this.contestantDatabase.getByExamId(id).then((contestants: IContestant[]) => {
          this.contestants = contestants;
        });
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

      if (_.some(this.contestants, (contestant: IContestant) => contestant.fullName == this.contestant.fullName)) {
        let message = {
          title: `Contestant information`,
          message: `Contestant with name is already existed. Please use another name.`
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = message;
        this.dialog.open(AlertDialogComponent, dialogConfig);
      } else {
        this.contestant.joinDate = (new Date).toString();
        this.contestantDatabase.add(this.contestant);
      }

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
