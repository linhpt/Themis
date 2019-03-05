import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  roomDetailsOpen = false;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle(open: boolean = false) {
    this.roomDetailsOpen = open;
    this.change.emit(this.roomDetailsOpen);
  }
}
