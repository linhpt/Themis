import Dexie from 'dexie';
import { ISubmission } from '../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  table: Dexie.Table<ISubmission, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('submission');
  }

  getAll(): Promise<ISubmission[]> {
    return this.table.toArray();
  }

  getByExamId(examId: number): Promise<ISubmission[]> {
    return this.table.where({examId: examId}).toArray();
  }

  getByTaskId(taskId: number): Promise<ISubmission[]> {
    return this.table.where({taskId: taskId}).toArray();
  }

  getByContestantId(contestantId: number): Promise<ISubmission[]> {
    return this.table.where({contestantId: contestantId}).toArray();
  }

  getByCondition(examId: number, taskId: number, contestantId: number): Promise<ISubmission[]> {
    return this.table.where({
      examId: examId,
      taskId: taskId,
      contestantId: contestantId
    }).toArray();
  }

  add(submission: ISubmission): Promise<number> {
    return this.table.add(submission);
  }

  update(id: number, submission: ISubmission): Promise<number> {
    return this.table.update(id, submission);
  }

  remove(id: number): Promise<void> {
    return this.table.delete(id);
  }

  removeByExamId(id: number): Promise<number> {
    return this.table.where('examId').equals(id).delete();
  }
}
