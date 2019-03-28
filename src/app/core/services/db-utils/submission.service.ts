import { ISubmission, DocType } from '../../interfaces/core';
import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';
import { DB } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionDatabase extends DB<ISubmission> {

  constructor(private dexie: DexieService) {
    super(dexie, 'submission');
  }
}
