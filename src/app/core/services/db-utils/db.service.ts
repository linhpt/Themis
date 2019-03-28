import Dexie from 'dexie';
import { IDocument } from '../../interfaces/core';
import { DexieService } from './dexie.service';

export class DB<T extends IDocument> {

    private _table: Dexie.Table<T, number>;

    constructor(private dexieService: DexieService, 
            private tbName: string) {
        this._table = this.dexieService.table(tbName);
    }

    getAll(): Promise<T[]> {
        return this._table.toArray();
    }

    add(document: T): Promise<number> {
        return this._table.add(document);
    }

    update(id: number, document: T): Promise<number> {
        return this._table.update(id, document);
    }

    remove(id: number): Promise<void> {
        return this._table.delete(id);
    }

    getById(id: number): Promise<T> {
        return this._table.get({ id });
    }

    getByTaskId(taskId: number): Promise<T[]> {
        return this._table.where('taskId').equals(taskId).toArray();
    }

    getByContestantId(contestantId: number): Promise<T[]> {
        return this._table.where('contestantId').equals(contestantId).toArray();
    }

    removeByExamId(examId: number): Promise<number> {
        return this._table.where('examId').equals(examId).delete();
    }

    getByExamId(examId: number): Promise<T[]> {
        return this._table.where({ examId }).toArray();
    }
}
