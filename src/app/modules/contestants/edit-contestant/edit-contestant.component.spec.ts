import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContestantComponent } from './edit-contestant.component';

describe('EditContestantComponent', () => {
  let component: EditContestantComponent;
  let fixture: ComponentFixture<EditContestantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContestantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContestantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
