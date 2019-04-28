import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css']
})
export class EditExamComponent implements OnInit {
  action = 'edit';
  examId: number;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.examId = +params['id'];
    });
  }
}
