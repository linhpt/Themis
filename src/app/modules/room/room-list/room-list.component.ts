import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/core/services/room.service';
import { IRoom } from 'src/app/core/interfaces/core';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  private roomList: IRoom[] = [];

  constructor(
    private utilsSerivce: UtilsService,
    private classService: RoomService
  ) { }

  ngOnInit() {

    this.classService.getAll().then((list: IRoom[]) => {
      console.log('roomList', list);
      if (list.length > 0) {
        this.utilsSerivce.setRoomDetailsOpen(true);
      } else {
        this.utilsSerivce.setRoomDetailsOpen(false);
      }
      this.roomList.push(...list);
    });
  }

}
