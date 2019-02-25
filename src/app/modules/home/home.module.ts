import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ClassesComponent } from './classes/classes.component';
import { HomeComponent } from './home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'classes',
        pathMatch: 'full'
      },
      {
        path: 'classes',
        component: ClassesComponent
      }
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent, AboutComponent, InstructionsComponent, ClassesComponent]
})
export class HomeModule { }
