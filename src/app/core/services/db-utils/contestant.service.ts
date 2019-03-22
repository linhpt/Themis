import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';
import { DB } from './db.service';
import { DocType } from '../../interfaces/core';

@Injectable({
  providedIn: 'root'
})
export class ContestantDatabase extends DB {

  constructor(private dexie: DexieService) {
    super(dexie);
    this._docType = DocType.CONTESTANT;
  }
}
