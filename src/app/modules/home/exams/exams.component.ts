import { Component, OnInit } from '@angular/core';
import { IExam } from 'src/app/core/interfaces/core';
import { remove } from 'lodash';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { SubmissionDatabase } from 'src/app/core/services/db-utils/submission.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  private exams: IExam[] = [];

  constructor(
    private dialog: MatDialog,
    private examDatabase: ExamDatabase,
    private taskDatabase: TaskDatabase,
    private contestantDatabase: ContestantDatabase,
    private submissionDatabase: SubmissionDatabase
  ) { }

  ngOnInit() {
    this.examDatabase.getAll().then((exams: IExam[]) => {
      this.exams = exams;
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
        remove(this.exams, (exam: IExam) => exam.id == id);
        this.examDatabase.remove(id);
        this.taskDatabase.removeByExamId(id);
        this.contestantDatabase.removeByExamId(id);
        this.submissionDatabase.removeByExamId(id);
      }
    });
  }
}
