import { Component, OnInit, Input } from '@angular/core';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { IExam } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AlertDialogComponent } from 'src/app/core/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  @Input() action: string = '';
  @Input() examId: number;
  exam: IExam = {};
  exams: IExam[] = [];
  editMode = false;

  constructor(
    private examDatabase: ExamDatabase,
    private location: Location,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    if (this.action == 'create') {
      this.examDatabase.getAll().then((exams: IExam[]) => {
        this.exams = exams;
      });
    } else if (this.action == 'edit') {
      this.examDatabase.getById(this.examId).then((exam: IExam) => {
        this.exam = exam;
      });
    }
  }

  onSubmit() {
    let now = new Date();
    this.exam.timeCreated = now.toString();
    this.exam.started = false;
    if (this.action == 'create') {
      if (_.some(this.exams, (exam: IExam) => exam.name == this.exam.name)) {
        let message = {
          title: `Exam information`,
          message: `Exam with name is already existed. Please use another name.`
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = message;
        this.dialog.open(AlertDialogComponent, dialogConfig);
      } else {
        this.examDatabase.add(this.exam).then(() => {
          this.back();
        });

      }
    }
    if (this.action == 'edit') {
      this.examDatabase.update(this.exam.id, this.exam).then(() => {
        this.back();
      });

    }
  }

  edit() {
    this.editMode = true;
  }

  back() {
    this.location.back();
  }

}
