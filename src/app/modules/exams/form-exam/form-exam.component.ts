import { Component, OnInit, Input } from '@angular/core';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { IExam } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-exam',
  templateUrl: './form-exam.component.html',
  styleUrls: ['./form-exam.component.css']
})
export class FormExamComponent implements OnInit {
  @Input() action: string = '';
  @Input() examId: number;
  exam: IExam = {};

  constructor(
    private examDatabase: ExamDatabase,
    private location: Location
  ) { }

  ngOnInit() {
    if (this.action == 'edit') {
      this.examDatabase.getById(this.examId).then((exam: IExam) => {
        this.exam = exam;
      });
    }
  }

  onSubmit() {
    let now = new Date();
    this.exam.timeCreated = now.toString();
    this.exam.started = false;
    if (this.action == 'create') {
      this.examDatabase.add(this.exam).then(() => {
        this.back();
      });  
    } else if (this.action == 'edit') {
      this.examDatabase.update(this.exam.id, this.exam).then(() => {
        this.back();
      });  

    }
  }

  back() {
    this.location.back();
  }

}
