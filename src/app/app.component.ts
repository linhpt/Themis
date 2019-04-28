import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from './core/services/sheet-utils/spreadsheet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  
  title = 'Themis Editor';

  constructor(
    private spreadsheetService: SpreadsheetService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let authResult = this.spreadsheetService.authorize();

    if (!authResult) {
      this.router.navigate(['/get-token']);
    }
  }
}
