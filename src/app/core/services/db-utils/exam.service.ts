import { IExam } from '../../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';
import { DB } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ExamDatabase extends DB<IExam> {

  constructor(private dexie: DexieService) {
    super(dexie, 'exam');
  }

}
