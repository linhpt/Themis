import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/class.service';
import { IClass } from 'test-win32-x64/resources/app/src/app/core/interfaces/core';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  private classList: IClass[] = [];
  private emptyMessage: string = 'There is no class for now!';

  constructor(
    private classService: ClassService
  ) { }

  ngOnInit() {
    this.classService.getAll().then((list: IClass[]) => {
      this.classList.push(...list);
    });
  }

}
