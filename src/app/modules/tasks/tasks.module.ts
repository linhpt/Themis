import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TaskComponent } from './task/task.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: 'create-task',
        component: CreateTaskComponent
      },
      {
        path: 'edit-task/:id',
        component: EditTaskComponent
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
  declarations: [TasksComponent, TaskComponent, CreateTaskComponent, EditTaskComponent]
})
export class TasksModule { }
