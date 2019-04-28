import { Component, OnInit } from '@angular/core';
import { IExam } from 'src/app/core/interfaces/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';
import { ISearchListener } from 'src/app/core/interfaces/ISearchListener';
import * as _ from 'lodash';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit, ISearchListener {

  private exams: IExam[] = [];
  private originExams: IExam[] = [];

  constructor(
    private dialog: MatDialog,
    private examDatabase: ExamDatabase,
    private taskDatabase: TaskDatabase,
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase
  ) { }

  ngOnInit() {
    this.examDatabase.getAll().then((exams: IExam[]) => {
      this.originExams = _.cloneDeep(exams);
      this.exams = _.cloneDeep(exams);
    });
  }

  remove(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Delete Exam Confirmation',
      message: `Are you sure you want to delete exam ${id}?`
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        _.remove(this.exams, (exam: IExam) => exam.id == id);
        this.examDatabase.remove(id);
        this.taskDatabase.removeByExamId(id);
        this.contestantDatabase.removeByExamId(id);
        this.submissionDatabase.removeByExamId(id);
      }
    });
  }

  search(name: string) {
    this.exams = _.filter(this.originExams, (exam: IExam) => {
      return _.lowerCase(exam.name).indexOf(_.lowerCase(name)) > -1;
    });
  }

  reset() {
    this.exams = _.cloneDeep(this.originExams);
  }
}
