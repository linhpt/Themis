import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie{
  constructor() {
    super('MyThemisDb');
    this.version(8).stores({
      exam: '++examId',
      task: '++taskId,examId',
      contestant: '++contestantId,examId',
      submission: '++submissionId,examId,taskId,contestantId'
    });
  }
}
