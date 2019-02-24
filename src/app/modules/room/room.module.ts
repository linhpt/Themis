import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoomComponent]
})
export class RoomModule { }
