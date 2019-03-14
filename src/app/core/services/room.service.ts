import Dexie from 'dexie';
import { IRoom } from '../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  table: Dexie.Table<IRoom, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('room');
  }

  getAll(): Promise<IRoom[]> {
    return this.table.toArray();
  }

  add(room: IRoom): Promise<number> {
    return this.table.add(room);
  }

  update(id: number, room: IRoom): Promise<number> {
    return this.table.update(id, room);
  }

  remove(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
