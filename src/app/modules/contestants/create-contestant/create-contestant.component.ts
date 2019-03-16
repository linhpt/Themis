import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-contestant',
  templateUrl: './create-contestant.component.html',
  styleUrls: ['./create-contestant.component.css']
})
export class CreateContestantComponent implements OnInit {

  action = 'create';
  constructor() { }

  ngOnInit() {
  }

}
