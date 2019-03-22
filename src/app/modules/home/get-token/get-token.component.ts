import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GspreadUtils, TOKEN_PATH } from 'src/app/core/services/sheet-utils/gspread.service';

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
    private gspread: GspreadUtils
  ) { }

  ngOnInit() {
    this._url = this.gspread.generateUrl();
  }

  onSubmit() {
    this.gspread.getToken(this.code, () => {
      this.back();
    });
  }

  back() {
    this.location.back();
  }

}
