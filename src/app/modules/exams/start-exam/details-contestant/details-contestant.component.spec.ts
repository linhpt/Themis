import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsContestantComponent } from './details-contestant.component';

describe('DetailsContestantComponent', () => {
  let component: DetailsContestantComponent;
  let fixture: ComponentFixture<DetailsContestantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsContestantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsContestantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
