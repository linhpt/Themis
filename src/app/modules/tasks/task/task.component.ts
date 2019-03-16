import { Component, OnInit, Input } from '@angular/core';
import { ITask } from 'src/app/core/interfaces/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/core/services/task.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() action: string;
  task: ITask = {};

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.task.examId = params['id'];
    });
  }

  back() {
    this.location.back();
  }

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.task.timeCreated = now.toString();
      this.taskService.add(this.task);
      this.back();
    }
  }
}
