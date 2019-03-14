import { Component, OnInit } from '@angular/core';
import { IRoom } from 'src/app/core/interfaces/core';
import { RoomService } from 'src/app/core/services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {

  model: any = {};

  constructor(
    private router: Router,
    private roomService: RoomService) { }

  onSubmit() {
    var now = new Date();
    const room: IRoom = {
      name: this.model.roomName,
      description: this.model.roomDescription,
      timeCreated: now.toString()
    }
    this.roomService.add(room);
    this.router.navigate(['/']);
  }

}
