import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { RoomListComponent } from './room-list/room-list.component';

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
  declarations: [RoomComponent, RoomListComponent]
})
export class RoomModule { }
