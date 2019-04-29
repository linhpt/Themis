import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamsComponent } from './exams.component';
import { CreateExamComponent } from './components/create-exam/create-exam.component';
import { EditExamComponent } from './components/edit-exam/edit-exam.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { OnlineExamComponent } from './components/online-exam/online-exam.component';
import { DetailsContestantComponent } from './components/online-exam/details-contestant/details-contestant.component';
import { RankingsContestantComponent } from './components/online-exam/rankings-contestant/rankings-contestant.component';
import { ExamComponent } from './components/exam/exam.component';
import { ExamManagementComponent } from './components/exam-management/exam-management.component';
import { DirectoryService } from './services/directory.service';
import { MailService } from './services/mail.service';

const routes: Routes = [
  {
    path: '',
    component: ExamsComponent,
    children: [
      {
        path: 'exam-management/:id',
        component: ExamManagementComponent
      },
      {
        path: 'create-exam',
        component: CreateExamComponent
      },
      {
        path: 'edit-exam/:id',
        component: EditExamComponent
      },
      {
        path: 'online-exam/:id',
        component: OnlineExamComponent
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ExamsComponent,
    ExamManagementComponent,
    CreateExamComponent,
    EditExamComponent,
    ExamComponent,
    OnlineExamComponent,
    DetailsContestantComponent,
    RankingsContestantComponent
  ],
  providers: [
    MailService,
    DirectoryService
  ]
})
export class ExamsModule { }
