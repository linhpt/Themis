import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { HomeComponent } from './home.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { GetTokenComponent } from './get-token/get-token.component';
import { ExamListComponent } from './exam-list/exam-list.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'exam-list',
        pathMatch: 'full'
      },
      {
        path: 'exam-list',
        component: ExamListComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'get-token',
        component: GetTokenComponent
      }
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
    HomeComponent, 
    AboutComponent, 
    InstructionsComponent, 
    SettingsComponent, 
    SettingsComponent, 
    ExamListComponent, 
    GetTokenComponent
  ]
})
export class HomeModule { }
