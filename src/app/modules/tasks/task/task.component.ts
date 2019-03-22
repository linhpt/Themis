import { Component, OnInit, Input } from '@angular/core';
import { ITask } from 'src/app/core/interfaces/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { Location } from '@angular/common';
import { first } from 'lodash';

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
    private taskDatabase: TaskDatabase
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      if (this.action == 'create') {
        this.task.examId = id;
      }
      if (this.action == 'edit'){
        this.taskDatabase.getById(id).then((tasks: ITask[]) => {
          this.task = first(tasks);
        });  
      }
    });
  }

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.task.timeCreated = now.toString();
      this.taskDatabase.add(this.task);
      this.back();
    }
  }

  back() {
    this.location.back();
  }
}
