import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoomListComponent } from './room-list/room-list.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { RoomComponent } from './room.component';
import { FormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: RoomComponent,
    children: [
      {
        path: '',
        redirectTo: 'create-room',
        pathMatch: 'full'
      },
      {
        path: 'create-room',
        component: CreateRoomComponent
      },
      {
        path: 'room-details/:id',
        component: RoomDetailsComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
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
  declarations: [RoomComponent, RoomListComponent, CreateRoomComponent, RoomDetailsComponent, SettingsComponent]
})
export class RoomModule { }
