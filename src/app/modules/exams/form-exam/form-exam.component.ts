import { Component, OnInit, Input } from '@angular/core';
import { ExamService } from 'src/app/core/services/db-utils/exam.service';
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
    private examService: ExamService,
    private location: Location
  ) { }

  ngOnInit() {
    if (this.action == 'edit') {
      this.examService.getById(this.examId).then((exams: IExam[]) => {
        this.exam = exams[0];
      });
    }
  }

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.exam.timeCreated = now.toString();
      this.exam.started = false;
      this.examService.add(this.exam).then(() => {
        this.back();
      });  
    }
  }

  back() {
    this.location.back();
  }

}
