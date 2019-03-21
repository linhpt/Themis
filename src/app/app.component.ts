import { Component, OnInit } from '@angular/core';
import { GspreadUtils } from './core/services/sheet-utils/gspread.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  
  title = 'Themis Editor';

  constructor(
    private gspread: GspreadUtils,
    private router: Router
  ) { }

  ngOnInit(): void {
    let authResult = this.gspread.authorize();

    if (!authResult) {
      this.router.navigate(['/get-token']);
    }
  }
}
