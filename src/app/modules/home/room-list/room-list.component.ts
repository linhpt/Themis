import { Component, OnInit } from '@angular/core';
import { IRoom } from 'src/app/core/interfaces/core';
import { RoomService } from 'src/app/core/services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  private roomList: IRoom[] = [];

  constructor(
    private classService: RoomService,
    private router: Router
  ) { }

  ngOnInit() {
    this.classService.getAll().then((list: IRoom[]) => {
      this.roomList.push(...list);
    });
  }

  view(room: IRoom) {
    this.router.navigate(['/room/room-details', room.id]);
  }

  settings() {
    this.router.navigate(['/room/settings']);
  }
}
