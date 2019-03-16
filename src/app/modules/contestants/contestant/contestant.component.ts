import { Component, OnInit, Input } from '@angular/core';
import { IContestant, IExam } from 'src/app/core/interfaces/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContestantService } from 'src/app/core/services/contestant.service';
import { Location } from '@angular/common';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-contestant',
  templateUrl: './contestant.component.html',
  styleUrls: ['./contestant.component.css']
})
export class ContestantComponent implements OnInit {

  @Input() action: string;
  contestant: IContestant = {};

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private examService: ExamService,
    private contestantService: ContestantService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.examService.getById(id).then((exams: IExam[]) => {
        this.contestant.examId = exams[0].examId;
      });
    });
  }

  onSubmit() {
    if (this.action == 'create') {
      let now = new Date();
      this.contestant.joinDate = now.toString();
      this.contestantService.add(this.contestant);
      this.back();
    }
  }

  back() {
    this.location.back();
  }
}
