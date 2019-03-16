import Dexie from 'dexie';
import { ITask } from '../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  table: Dexie.Table<ITask, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('task');
  }

  getAll(): Promise<ITask[]> {
    return this.table.toArray();
  }

  getByExamId(examId: number): Promise<ITask[]> {
    return this.table.where({examId: examId}).toArray();
  }

  add(task: ITask): Promise<number> {
    return this.table.add(task);
  }

  update(id: number, task: ITask): Promise<number> {
    return this.table.update(id, task);
  }

  remove(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
