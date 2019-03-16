import { Component, OnInit, Input } from '@angular/core';
import { ITask } from 'src/app/core/interfaces/core';
import { Router } from '@angular/router';
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
    private taskService: TaskService
  ) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

  onSubmit() {
    if (this.action == 'create') {
      this.taskService.add(this.task);
      this.router.navigate(['/']);
    }
  }
}
