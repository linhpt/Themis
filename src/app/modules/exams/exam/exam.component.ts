import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IExam, ITask, IContestant, DocType } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { GspreadUtils } from 'src/app/core/services/sheet-utils/gspread.service';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { ContestantDatabase } from 'src/app/core/services/db-utils/contestant.service';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { first, remove } from 'lodash';


@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  exam: IExam = {};
  tasks: ITask[] = [];
  contestants: IContestant[] = [];

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private gspread: GspreadUtils,
    private taskDatabase: TaskDatabase,
    private examDatabase: ExamDatabase,
    private contestantDatabase: ContestantDatabase
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      const id = +params['id'];
      let exams = await this.examDatabase.getById(id);
      this.exam = first(exams);

      let tasks = await this.taskDatabase.getByExamId(id);
      if (tasks) {
        this.tasks = tasks;
      }

      let contestants = await this.contestantDatabase.getByExamId(id);
      if (contestants) {
        this.contestants = contestants;
      }
    });
  }

  remove(id: number, type: string) {

    let docType = DocType[type];
    let message = {
      title: `Delete ${type} Confirmation`,
      message: `Are you sure you want to delete ${type} ${id}?`
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = message;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) return;

      if (docType == DocType.CONTESTANT) {
        remove(this.contestants, (contestant: IContestant) => contestant.id == id);
        return this.contestantDatabase.remove(id);
      }
      
      if (docType == DocType.TASK) {
        remove(this.tasks, (task: ITask) => task.id == id);
        return this.taskDatabase.remove(id);
      }
    });
  }

  start() {
    this.gspread.createSpreadsheet(this.exam, () => {
      this.gspread.updateSpreadsheet(this.exam, () => {
        this.router.navigate(['/exams/start-exam', this.exam.id]);
      })
    });
  }

  back() {
    this.location.back();
  }
}
