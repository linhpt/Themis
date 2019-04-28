import { Component, OnInit, Input } from '@angular/core';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { IExam } from 'src/app/core/interfaces/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  @Input() action: string = '';
  @Input() examId: number;
  exam: IExam = {};
  editMode = false;

  constructor(
    private examDatabase: ExamDatabase,
    private location: Location
  ) { }

  ngOnInit() {
    if (this.action == 'edit') {
      console.log('examId', this.examId)

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
    }
    if (this.action == 'edit') {
      this.examDatabase.update(this.exam.id, this.exam).then(() => {
        this.back();
      });  

    }
  }

  edit() {
    this.editMode = true;
  }

  back() {
    this.location.back();
  }

}
