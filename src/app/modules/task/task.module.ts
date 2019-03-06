import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { Route, Routes, RouterModule } from '@angular/router';
import { CreateTaskComponent } from './create-task/create-task.component';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    children: [
      {
        path: '',
        redirectTo: 'create-task',
        pathMatch: 'full'
      },
      {
        path: 'create-task',
        component: CreateTaskComponent
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
  declarations: [TaskComponent, CreateTaskComponent]
})
export class TaskModule { }
