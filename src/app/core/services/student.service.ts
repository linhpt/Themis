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
    this.table = this.dexieService.table('students');
  }

  getAll(): Promise<IStudent[]> {
    return this.table.toArray();
  }

  add(data: IStudent): Promise<number> {
    return this.table.add(data);
  }

  update(id: number, data: IStudent): Promise<number> {
    return this.table.update(id, data);
  }

  remove(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
