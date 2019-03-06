import { Component, OnInit } from '@angular/core';
const fs = (<any>window).require("fs");
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  model: any = {};

  onSubmit() {
    let dir = `C:\\Users\\linhp\\Documents\\personal\\testTask\\${this.model.taskName}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
}
