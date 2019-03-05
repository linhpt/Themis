import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClassService } from 'src/app/core/services/class.service';
import { IClass } from 'src/app/core/interfaces/core';
import * as _ from 'lodash';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.utilsService.toggle(true);
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.classService.getAll().then((classList: IClass[]) => {
        const viewClass = _.find(classList, (cls: IClass) => cls.id == id);
      });
    });
  }

}
