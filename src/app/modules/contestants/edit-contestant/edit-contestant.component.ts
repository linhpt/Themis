import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-contestant',
  templateUrl: './edit-contestant.component.html',
  styleUrls: ['./edit-contestant.component.css']
})
export class EditContestantComponent implements OnInit {

  action = 'edit';
  constructor() { }

  ngOnInit() {
  }

}
