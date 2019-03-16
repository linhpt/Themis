import { Injectable } from '@angular/core';
import * as creds from 'src/app/core/credentials/client_secret.json';
const GoogleSpreadsheet = (<any>window).require('google-spreadsheet');


@Injectable({
    providedIn: 'root'
})
export class SpreadsheetUtils {

    document: any;
    sheet: any;
    headers: Array<string>;
    rows: Array<Array<string>>;

    constructor(
    ) {
    }

    set headerRow(headers: Array<string>) {
        this.headers = headers;
    }

    set spreadsheetRows(rows: Array<Array<string>>) {
        this.rows = rows;
    }

    updateSheet() {
        let spreadsheetId = localStorage.getItem('spreadsheetId');
        this.document = new GoogleSpreadsheet(spreadsheetId);

        this.document.useServiceAccountAuth(creds, (err) => {
            this.document.getInfo((err, info) => {
                this.sheet = info.worksheets[0];
                this.sheet.setHeaderRow(this.headers);
                for (var i = 0; i < this.rows.length; i++) {
                    let row = this.rows[i];
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
