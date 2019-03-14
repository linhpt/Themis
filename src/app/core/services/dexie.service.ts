import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie{
  constructor() {
    super('MyThemisDatabase');
    this.version(7).stores({
      room: '++id',
      student: '++id',
      submition: '++id'
    });
  }
}
