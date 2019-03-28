import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';
import { DB } from './db.service';
import { IContestant } from '../../interfaces/core';

@Injectable({
  providedIn: 'root'
})
export class ContestantDatabase extends DB<IContestant> {

  constructor(private dexie: DexieService) {
    super(dexie, 'contestant');
  }
}
