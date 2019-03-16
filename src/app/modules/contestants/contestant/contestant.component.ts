import { Component, OnInit, Input } from '@angular/core';
import { IContestant } from 'src/app/core/interfaces/core';
import { Router } from '@angular/router';
import { ContestantService } from 'src/app/core/services/contestant.service';
import { Location } from '@angular/common';

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
    private contestantService: ContestantService
  ) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

  onSubmit() {
    if (this.action == 'create') {
      this.contestantService.add(this.contestant);
      this.router.navigate(['/']);
    }
  }
}
