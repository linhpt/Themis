import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IExam, ITask, IContestant } from 'src/app/core/interfaces/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { TaskService } from 'src/app/core/services/task.service';
import { ContestantService } from 'src/app/core/services/contestant.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  @Input() action: string;
  exam: IExam = {};
  tasks: ITask[];
  contestants: IContestant[];

  constructor(
    private router: Router,
    private examService: ExamService,
    private taskService: TaskService,
    private location: Location,
    private route: ActivatedRoute,
    private contestantService: ContestantService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.examService.getById(id).then((exams: IExam[]) => {
        Object.assign(this.exam, exams[0]);
      });
      this.taskService.getByExamId(id).then((tasks: ITask[]) =>{
        this.tasks.push(...tasks);
      });
    });
    this.taskService.getAll().then((tasks: ITask[]) => {
      this.tasks = tasks;
    });
    this.contestantService.getAll().then((contestants: IContestant[]) => {
      this.contestants = contestants;
    });
  }

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.exam.timeCreated = now.toString();
      this.examService.add(this.exam);
      this.router.navigate(['/']);  
    }
  }

  back() {
    this.location.back();
  }

  load() {

  }
}
