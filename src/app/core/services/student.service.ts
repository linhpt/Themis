import Dexie from 'dexie';
import { IStudent } from '../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  table: Dexie.Table<IStudent, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('student');
  }

  getAll(): Promise<IStudent[]> {
    return this.table.toArray();
  }

  getByRoomId(roomId: string): Promise<IStudent[]> {
    return this.table.where({roomId: roomId}).toArray();
  }

  add(student: IStudent): Promise<number> {
    return this.table.add(student);
  }

  update(id: number, student: IStudent): Promise<number> {
    return this.table.update(id, student);
  }

  remove(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
