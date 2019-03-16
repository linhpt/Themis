import Dexie from 'dexie';
import { IContestant } from '../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';

@Injectable({
  providedIn: 'root'
})
export class ContestantService {

  table: Dexie.Table<IContestant, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('contestant');
  }

  getAll(): Promise<IContestant[]> {
    return this.table.toArray();
  }

  getByExamId(examId: number): Promise<IContestant[]> {
    return this.table.where({examId: examId}).toArray();
  }

  add(contestant: IContestant): Promise<number> {
    return this.table.add(contestant);
  }

  update(id: number, contestant: IContestant): Promise<number> {
    return this.table.update(id, contestant);
  }

  remove(id: number): Promise<void> {
    return this.table.delete(id);
  }
}
