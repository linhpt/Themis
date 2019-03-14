import Dexie from 'dexie';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie{
  constructor() {
    super('ThemisDatabase');
    this.version(6).stores({
      class: '++id',
      student: '++id',
      submition: '++id'
    });
  }
}
