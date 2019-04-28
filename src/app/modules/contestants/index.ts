import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContestantsComponent } from './contestants.component';
import { ContestantComponent } from './contestant/contestant.component';
import { CreateContestantComponent } from './create-contestant/create-contestant.component';
import { EditContestantComponent } from './edit-contestant/edit-contestant.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: ContestantsComponent,
    children: [
      {
        path: 'create-contestant/:id',
        component: CreateContestantComponent
      },
      {
        path: 'edit-contestant/:id',
        component: EditContestantComponent
      }
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ContestantsComponent, 
    ContestantComponent, 
    CreateContestantComponent, 
    EditContestantComponent
  ]
})
export class ContestantsModule { }
