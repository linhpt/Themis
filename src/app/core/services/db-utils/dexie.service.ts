import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie{
  constructor() {
    super('ThemisDatabase');
    this.version(9).stores({
      exam: '++id',
      task: '++id,examId',
      contestant: '++id,examId',
      submission: '++id,examId,taskId,contestantId'
    });
  }
}
