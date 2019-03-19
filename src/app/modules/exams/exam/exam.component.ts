import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IExam, ITask, IContestant } from 'src/app/core/interfaces/core';
import { ExamService } from 'src/app/core/services/db-utils/exam.service';
import { TaskService } from 'src/app/core/services/db-utils/task.service';
import { ContestantService } from 'src/app/core/services/db-utils/contestant.service';
import { Location } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  @Input() action: string;
  exam: IExam = {};
  tasks: ITask[] = [];
  contestants: IContestant[] = [];

  constructor(
    private examService: ExamService,
    private taskService: TaskService,
    private location: Location,
    private route: ActivatedRoute,
    private contestantService: ContestantService
  ) { }

  ngOnInit() {
    if (this.action == 'create') return;

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

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.exam.timeCreated = now.toString();
      this.exam.started = false;
      this.examService.add(this.exam).then(() => {
        this.back();
      });
    }
  }

  remove(id: number, field: string = 'Contestant') {
    if (field == 'Contestant') {
      this.contestantService.remove(id);
      _.remove(this.contestants, (contestant: IContestant) => contestant.contestantId == id);
    } else if (field == 'Task') {
      this.taskService.remove(id);
      _.remove(this.tasks, (task: ITask) => task.taskId == id);
    }
  }

  back() {
    this.location.back();
  }
}
