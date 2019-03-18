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
    private location: Location,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      if (this.action == 'create') {
        this.task.examId = id;
      }
      if (this.action == 'edit'){
        this.taskService.getById(id).then((task: ITask[]) => {
          Object.assign(this.task, task[0]);
        });  
      }
    });
  }

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.task.timeCreated = now.toString();
      this.taskService.add(this.task);
      this.back();
    }
  }

  back() {
    this.location.back();
  }
}
