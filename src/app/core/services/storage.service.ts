import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get studentFolder() {
    return localStorage.getItem('studentFolder');
  }

  get spreadsheetId() {
    return localStorage.getItem('spreadsheetId');
  }
  
}
