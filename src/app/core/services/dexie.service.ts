import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie{
  constructor() {
    super('NgDexieDatabase');
    this.version(5).stores({
      class: '++id',
      student: '++id',
      submition: '++id'
    });
  }
}
