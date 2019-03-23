import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsContestantComponent } from './rankings-contestant.component';

describe('RankingsContestantComponent', () => {
  let component: RankingsContestantComponent;
  let fixture: ComponentFixture<RankingsContestantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingsContestantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingsContestantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
