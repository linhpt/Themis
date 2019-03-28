import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';
import { DB } from './db.service';
import { ITask } from '../../interfaces/core';

@Injectable({
  providedIn: 'root'
})
export class TaskDatabase extends DB<ITask>{

  constructor(private dexie: DexieService) {
    super(dexie, 'task');
  }

}
