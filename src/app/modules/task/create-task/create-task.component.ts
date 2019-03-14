import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
const fs = (<any>window).require("fs");

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  model: any = {};

  onSubmit() {
    let dir = `C:\\Users\\linhp\\Documents\\personal\\Tasks\\${this.model.taskName}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      this.router.navigate(['/']);
    }
  }
}
