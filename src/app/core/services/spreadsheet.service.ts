import { Injectable } from '@angular/core';
import * as creds from 'src/app/core/credentials/client_secret.json';
const GoogleSpreadsheet = (<any>window).require('google-spreadsheet');


@Injectable({
    providedIn: 'root'
})
export class SpreadsheetUtils {

    document: any;
    sheet: any;
    _headers: Array<string>;
    _rows: Array<Array<string>>;

    set headers(headers: Array<string>) {
        this._headers = headers;
    }

    set rows(rows: Array<Array<string>>) {
        this._rows = rows;
    }

    updateSheet() {
        let spreadsheetId = localStorage.getItem('spreadsheetId');
        this.document = new GoogleSpreadsheet(spreadsheetId);

        this.document.useServiceAccountAuth(creds, (err) => {
            this.document.getInfo((err, info) => {
                this.sheet = info.worksheets[0];
                this.sheet.setHeaderRow(this._headers);
                for (var i = 0; i < this._rows.length; i++) {
                    let row = this._rows[i];
                }
                this.sheet.addRow({ last_name: 'Agnew', first_name: 'Samuel' }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    }

}
