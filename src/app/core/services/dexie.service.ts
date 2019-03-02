import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie{
  constructor() {
    super('NgDexieDatabase');
    this.version(2).stores({
      classes: '++id',
      students: '++id',
      submitions: '++id'
    });
  }
}
