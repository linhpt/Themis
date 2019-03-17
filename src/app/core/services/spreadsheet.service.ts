import { Injectable } from '@angular/core';
import * as creds from 'src/app/core/credentials/client_secret.json';
import { IContestant } from '../interfaces/core';
const GoogleSpreadsheet = (<any>window).require('google-spreadsheet');


@Injectable({
    providedIn: 'root'
})
export class SpreadsheetUtils {

    document: any;
    sheet: any;
    _headers: Array<string>;
    _rows: Array<IContestant>;
    _scoreBoard: Array<Array<string>>;

    set headers(headers: Array<string>) {
        this._headers = headers;
    }

    set rows(rows: Array<IContestant>) {
        this._rows = rows;
    }

    set scoreBoard(scoreBoard: Array<Array<string>>) {
        this._scoreBoard = scoreBoard;
    }

    updateSheet() {
        let spreadsheetId = localStorage.getItem('spreadsheetId');
        this.document = new GoogleSpreadsheet(spreadsheetId);
        this.document.useServiceAccountAuth(creds, (err) => {
            this.document.getInfo((err, info) => {
                this.sheet = info.worksheets[0];
                this.sheet.getRows((err, rows) => {
                    console.log('rows', rows);
                });
                this.sheet.setHeaderRow(this._headers, (err) => {
                    if (err) {
                        console.log('Header error', err);
                    }
                });
                for (var i = 0; i < this._rows.length; i++) {
                    let rowValues = [
                        this._rows[i].contestantId,
                        this._rows[i].firstName,
                        this._rows[i].lastName,
                        this._rows[i].dob,
                        ...this._scoreBoard[i]
                    ];

                    let row = {};
                    for(var j = 0; j < this._headers.length; j++){
                        row[this._headers[j]] = rowValues[j];
                    }

                    this.sheet.addRow(row, (err) => {
                        if (err) {
                            console.log('Row error', err);
                        }
                    });
                }
            });
        });
    }

}
