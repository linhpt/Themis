import { IExam, DocType } from '../../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';
import { DB } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ExamDatabase extends DB {

  constructor(private dexie: DexieService) {
    super(dexie);
    this._docType = DocType.EXAM;
  }

}
