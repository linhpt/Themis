import { Injectable } from '@angular/core';
const { google } = (<any>window).require('googleapis');
import * as credentials from 'src/assets/credentials.json';
import { IExam } from '../../interfaces/core';
import { ExamDatabase } from '../db-utils/exam.service';
import * as _ from 'lodash';

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
export const TOKEN_PATH = 'token.json';
export const RANKINGS = 'Rankings';
export const SUBMISSIONS = 'Submissions';

export type CB = () => void;


@Injectable({
    providedIn: 'root'
})
export class GspreadUtils {
    oAuth2Client: any;
    constructor(
        private examDatabase: ExamDatabase
    ) { }

    authorize() {
        const { client_secret, client_id, redirect_uris } = (<any>credentials).installed;
        this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        const token = localStorage.getItem(TOKEN_PATH);
        let res = false;
        if (token) {
            this.oAuth2Client.setCredentials(JSON.parse(token));
            res = true;
        }
        return res;
    }

    getToken(code: string, cb?: CB) {
        this.oAuth2Client.getToken(code, (err: string, token: string) => {
            if (err) {
                return console.error('Error while trying to retrieve access token', err);
            }
            this.oAuth2Client.setCredentials(token);
            localStorage.setItem(TOKEN_PATH, JSON.stringify(token));
            if (cb && typeof cb == 'function') {
                cb();
            }
        });
    }

    generateUrl() {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        return authUrl;
    }

    createSpreadsheet(exam: IExam, cb?: CB) {
        const { id, name, sheetId } = exam;
        if (sheetId) {
            if (cb && typeof cb == 'function') {
                cb();
            }
            return console.info(`Sheet with exam ${name} is already existed`);
        }
        const resource = {
            properties: {
                title: name,
            },
            sheets: [{
                properties: {
                    title: RANKINGS,
                    index: 1
                }
            },
            {
                properties: {
                    title: SUBMISSIONS,
                    index: 2
                }
            }]
        };
        const sheets = google.sheets({ version: 'v4', auth: this.oAuth2Client });
        sheets.spreadsheets.create({
            resource,
            fields: 'spreadsheetId',
        }, (err: string, spreadsheet: any) => {
            if (err) {
                return console.error(`Error while trying create spreadsheet: ${err}`);
            }
            exam.sheetId = spreadsheet.data.spreadsheetId;
            this.examDatabase.update(id, exam);
            if (cb && typeof cb == 'function') {
                cb();
            }
        });

    }

    update(exam: IExam, sheetName: string, data: any, cb: CB) {
        let callback = cb && typeof cb == 'function' ? cb : () => true;
        console.log(data);
        this._updateSheet(exam, sheetName, data, callback);
    }

    private _updateSheet(exam: IExam, sheetName: string, values: any, cb: CB) {

        if (sheetName != RANKINGS && sheetName != SUBMISSIONS) return console.error(`error: cannot update sheet with name ${sheetName}`);
        const { sheetId } = exam;
        const sheets = google.sheets('v4');
        sheets.spreadsheets.values.update({
            auth: this.oAuth2Client,
            spreadsheetId: sheetId,
            range: `${sheetName}!A2`,
            valueInputOption: "USER_ENTERED",
            resource: { values }
        }, (err: string, response: any) => {
            if (err) return console.error(`The API returned an error: ${err}`);
            cb();
        });

    }

}
