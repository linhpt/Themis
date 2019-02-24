import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppInfoComponent } from './app-info/app-info.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent, AppInfoComponent]
})
export class HomeModule { }
