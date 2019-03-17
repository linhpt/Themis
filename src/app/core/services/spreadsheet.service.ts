import { Injectable } from '@angular/core';
import * as creds from 'src/app/core/credentials/client_secret.json';
import { IContestant } from '../interfaces/core';
const GoogleSpreadsheet = (<any>window).require('google-spreadsheet');


@Injectable({
    providedIn: 'root'
})
export class SpreadsheetUtils {
    SPREADSHEET_ID: string;

    document: any;
    sheet: any;
    _headers: Array<string>;
    _rows: Array<IContestant>;
    _scoreBoard: Array<Array<string>>;
    _started: boolean = false;

    sheetRows: any;

    constructor() {
        this.SPREADSHEET_ID = localStorage.getItem('spreadsheetId');
    }

    set started(started: boolean) {
        this._started = started;
    }

    set headers(headers: Array<string>) {
        this._headers = headers;
    }

    set rows(rows: Array<IContestant>) {
        this._rows = rows;
    }

    set scoreBoard(scoreBoard: Array<Array<string>>) {
        this._scoreBoard = scoreBoard;
    }

    createSheet() {
        this.document = new GoogleSpreadsheet(this.SPREADSHEET_ID);
        this.document.useServiceAccountAuth(creds, (err: any) => {
            this.document.getInfo((err: any, info: any) => {
                this.sheet = info.worksheets[0];
                if (!this._started) {
                    this.createSpreadsheet();
                }
            });
        });
    }

    updateSheet(info: { contestantIndex: number, taskIndex: number, taskName: string, score: string}) {
        if (this.sheetRows) {
            this.updateSpreadsheet(info);
        } else {
            this.sheet.getRows({
                offset: 1,
                limit: this._scoreBoard.length
            }, (err: any, rows: any) => {
                this.sheetRows = rows;
                this.updateSpreadsheet(info);
            });
        }
    }

    private updateSpreadsheet(info: { contestantIndex: number, taskIndex: number, taskName: string, score: string}) {
        this.sheetRows[info.contestantIndex][info.taskName.toLowerCase()] = info.score;
        this.sheetRows[info.contestantIndex].save();
    }

    private createSpreadsheet() {
        this.sheet.setHeaderRow(this._headers, (err: any) => {
            if (!err) {
                for (var i = 0; i < this._rows.length; i++) {
                    let rowValues = [
                        this._rows[i].contestantId,
                        this._rows[i].firstName,
                        this._rows[i].lastName,
                        this._rows[i].dob,
                        ...this._scoreBoard[i]
                    ];

                    let row = {};
                    for (var j = 0; j < this._headers.length; j++) {
                        row[this._headers[j]] = rowValues[j];
                    }

                    this.sheet.addRow(row, (err) => {
                        if (!err) {
                            this._started = true;
                        }
                    });
                }
            }
        });
    }

}
