import { Component, OnInit } from '@angular/core';
import { IExam } from 'src/app/core/interfaces/core';
import { ExamService } from 'src/app/core/services/db-utils/exam.service';
import { TaskService } from 'src/app/core/services/db-utils/task.service';
import { ContestantService } from 'src/app/core/services/db-utils/contestant.service';
import { SubmissionService } from 'src/app/core/services/db-utils/submission.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  private examList: IExam[] = [];

  constructor(
    private examService: ExamService,
    private taskService: TaskService,
    private contestantService: ContestantService,
    private submissionService: SubmissionService
  ) { }

  ngOnInit() {
    this.examService.getAll().then((list: IExam[]) => {
      this.examList.push(...list);
    });
  }

  remove(examId: number) {
    this.examService.remove(examId);
    this.taskService.removeByExamId(examId);
    this.contestantService.removeByExamId(examId);
    this.submissionService.removeByExamId(examId);
    _.remove(this.examList, (exam: IExam) => exam.examId == examId);
  }
}
