import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { RenameComponent } from './rename/rename.component';
import { CoreModule } from 'src/app/core/core.module';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'rename',
        pathMatch: 'full'
      },
      {
        path: 'rename',
        component: RenameComponent
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
  declarations: [HomeComponent, AboutComponent, InstructionsComponent, RenameComponent]
})
export class HomeModule { }
