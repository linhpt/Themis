import { Component, OnInit } from '@angular/core';
import { IExam } from 'src/app/core/interfaces/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  private examList: IExam[] = [];

  constructor(
    private examService: ExamService,
    private router: Router
  ) { }

  ngOnInit() {
    this.examService.getAll().then((list: IExam[]) => {
      this.examList.push(...list);
    });
  }
}
