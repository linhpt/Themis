import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SpreadsheetService } from 'src/app/core/services/sheet-utils/spreadsheet.service';

@Component({
  selector: 'app-get-token',
  templateUrl: './get-token.component.html',
  styleUrls: ['./get-token.component.css']
})
export class GetTokenComponent implements OnInit {
  _url: string;
  code: string = '';

  constructor(
    private location: Location,
    private spreadsheetService: SpreadsheetService
  ) { }

  ngOnInit() {
    this._url = this.spreadsheetService.generateUrl();
  }

  onSubmit() {
    this.spreadsheetService.getToken(this.code, () => {
      this.back();
    });
  }

  back() {
    this.location.back();
  }

}
