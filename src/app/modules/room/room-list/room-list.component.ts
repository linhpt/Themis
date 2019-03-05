import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/class.service';
import { IClass } from 'src/app/core/interfaces/core';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  private classList: IClass[] = [];
  private emptyMessage: string = 'There is no class for now!';

  constructor(
    private utilsSerivce: UtilsService,
    private classService: ClassService
  ) { }

  ngOnInit() {
    this.utilsSerivce.toggle(false);
    this.classService.getAll().then((list: IClass[]) => {
      this.classList.push(...list);
    });
  }

}
