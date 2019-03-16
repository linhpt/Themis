import Dexie from 'dexie';
import { IExam } from '../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  table: Dexie.Table<IExam, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('exam');
  }

  getAll(): Promise<IExam[]> {
    return this.table.toArray();
  }

  getById(examId: number): Promise<IExam[]> {
    return this.table.where({examId: examId}).toArray();
  }

  add(exam: IExam): Promise<number> {
    return this.table.add(exam);
  }

  update(id: number, exam: IExam): Promise<number> {
    return this.table.update(id, exam);
  }

  remove(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
