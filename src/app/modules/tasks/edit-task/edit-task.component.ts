import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  action = 'edit';
  constructor() { }

  ngOnInit() {
  }

}
