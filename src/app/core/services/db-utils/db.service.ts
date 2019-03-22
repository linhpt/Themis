import Dexie from 'dexie';
import { IContestant, ITask, IExam, IDocument, DocType, ISubmission } from '../../interfaces/core';
import { DexieService } from './dexie.service';

export class DB {

    private _contestant: Dexie.Table<IContestant, number>;
    private _task: Dexie.Table<ITask, number>;
    private _exam: Dexie.Table<IExam, number>;
    private _submission: Dexie.Table<IExam, number>;
    _docType: DocType;

    constructor(private dexieService: DexieService) {
        this._contestant = this.dexieService.table('contestant');
        this._task = this.dexieService.table('task');
        this._exam = this.dexieService.table('exam');
        this._submission = this.dexieService.table('submission');
    }

    private _getDocument(): Dexie.Table<IDocument, number> {
        if (this._docType == DocType.EXAM) {
            return this._exam;
        } else if (this._docType == DocType.CONTESTANT) {
            return this._contestant;
        } else if (this._docType == DocType.TASK) {
            return this._task;
        } else if (this._docType == DocType.SUBMISSION) {
            return this._submission;
        }
    }

    private _hasExamId(): boolean {
        return this._docType == DocType.TASK ||
            this._docType == DocType.CONTESTANT ||
            this._docType == DocType.SUBMISSION;
    }

    getAll(): Promise<IDocument[]> {
        return this._getDocument().toArray();
    }

    add(document: IDocument): Promise<number> {
        return this._getDocument().add(document);
    }

    update(id: number, document: IDocument): Promise<number> {
        return this._getDocument().update(id, document);
    }

    remove(id: number): Promise<void> {
        return this._getDocument().delete(id);
    }

    getById(id: number): Promise<IDocument[]> {
        return this._getDocument().where({ id: id }).toArray();
    }

    getByTaskId(taskId: number): Promise<ISubmission[]> {
        return this._submission.where('taskId').equals(taskId).toArray();
    }

    getByContestantId(contestantId: number): Promise<ISubmission[]> {
        return this._submission.where('contestantId').equals(contestantId).toArray();
    }

    removeByExamId(examId: number): Promise<number> {
        return this._getDocument().where('examId').equals(examId).delete();
    }

    getByExamId(examId: number): Promise<IDocument[]> {
        if (this._hasExamId()) {
            return this._getDocument().where({ examId }).toArray();
        }
    }
}
