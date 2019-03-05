import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  
  private roomDetailsOpen: boolean = false;
  private title = 'Themis Editor';

  constructor(
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.utilsService.change.subscribe((isOpen: boolean) => {
      this.roomDetailsOpen = isOpen;
    })
  }

  loadFromExcel() {
    
  }

}
