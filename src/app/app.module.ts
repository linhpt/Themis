import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { Routes, RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './modules/home#HomeModule'
  },
  {
    path: 'exams',
    loadChildren: './modules/exams#ExamsModule',
  },
  {
    path: 'tasks',
    loadChildren: './modules/tasks#TasksModule',
  },
  {
    path: 'contestants',
    loadChildren: './modules/contestants#ContestantsModule',
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CoreModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
