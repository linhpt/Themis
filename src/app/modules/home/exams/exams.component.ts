import { Component, OnInit } from '@angular/core';
import { IExam } from 'src/app/core/interfaces/core';
import { ExamService } from 'src/app/core/services/db-utils/exam.service';
import { TaskService } from 'src/app/core/services/db-utils/task.service';
import { ContestantService } from 'src/app/core/services/db-utils/contestant.service';
import { SubmissionService } from 'src/app/core/services/db-utils/submission.service';
import * as _ from 'lodash';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  private examList: IExam[] = [];

  constructor(
    private dialog: MatDialog,
    private examService: ExamService,
    private taskService: TaskService,
    private contestantService: ContestantService,
    private submissionService: SubmissionService
  ) { }

  ngOnInit() {
    this.examService.getAll().then((list: IExam[]) => {
      this.examList.push(...list);
    });
  }

  remove(examId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Delete Exam Confirmation',
      message: `Are you sure you want to delete exam ${examId}?`
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.examService.remove(examId);
        this.taskService.removeByExamId(examId);
        this.contestantService.removeByExamId(examId);
        this.submissionService.removeByExamId(examId);
        _.remove(this.examList, (exam: IExam) => exam.examId == examId);
      }
    });
  }
}
