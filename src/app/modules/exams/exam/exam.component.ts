import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IExam, ITask, IContestant } from 'src/app/core/interfaces/core';
import { ExamService } from 'src/app/core/services/db-utils/exam.service';
import { TaskService } from 'src/app/core/services/db-utils/task.service';
import { ContestantService } from 'src/app/core/services/db-utils/contestant.service';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/core/confirm-dialog/confirm-dialog.component';
import { GspreadUtils } from 'src/app/core/services/sheet-utils/gspread.service';

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
    private examService: ExamService,
    private taskService: TaskService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private gspread: GspreadUtils,
    private contestantService: ContestantService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      const id = +params['id'];
      let exams = await this.examService.getById(id);
      Object.assign(this.exam, exams[0]);

      let tasks = await this.taskService.getByExamId(id);
      if (tasks) {
        this.tasks.push(...tasks);
      }

      let contestants = await this.contestantService.getByExamId(id);
      if (contestants) {
        this.contestants.push(...contestants);
      }
    });
  }

  remove(id: number, field: 'Contestant' | 'Task') {
    let message = this.message(field, id);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = message;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        if (field == 'Contestant') {
          this.contestantService.remove(id);
          _.remove(this.contestants, (contestant: IContestant) => contestant.contestantId == id);
        } else if (field == 'Task') {
          this.taskService.remove(id);
          _.remove(this.tasks, (task: ITask) => task.taskId == id);
        }
      }
    });
  }

  message(field: 'Contestant' | 'Task', id: number) {
    if (field == 'Contestant') {
      return {
        title: 'Delete Contestant Confirmation',
        message: `Are you sure you want to delete Contestant ${id}?`
      }
    } else if (field == 'Task') {
      return {
        title: 'Delete Task Confirmation',
        message: `Are you sure you want to delete Task ${id}?`
      }

    }
  }

  start() {
    this.gspread.createSpreadsheet(this.exam, () => {
      this.gspread.updateSpreadsheet(this.exam, () => {
        this.router.navigate(['/exams/start-exam', this.exam.examId]);
      })
    });
  }

  back() {
    this.location.back();
  }
}
