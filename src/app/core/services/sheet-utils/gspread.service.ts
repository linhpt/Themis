import { Injectable } from '@angular/core';
const { google } = (<any>window).require('googleapis');
import * as credentials from 'src/assets/credentials.json';
import { IExam } from '../../interfaces/core';
import { ExamService } from '../db-utils/exam.service';

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
export const TOKEN_PATH = 'token.json';


@Injectable({
    providedIn: 'root'
})
export class GspreadUtils {
    oAuth2Client: any;
    constructor(
        private examService: ExamService
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

    getToken(code: string, callback?: () => void) {
        this.oAuth2Client.getToken(code, (err: string, token: string) => {
            if (err) {
                return console.error('Error while trying to retrieve access token', err);
            }
            this.oAuth2Client.setCredentials(token);
            localStorage.setItem(TOKEN_PATH, JSON.stringify(token));
            if (callback && typeof callback == 'function') {
                callback();
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

    createSpreadsheet(exam: IExam, callback?: () => void) {
        const { name, examId, sheetId } = exam;
        if (sheetId) {

            if (callback && typeof callback == 'function') {
                callback();
            }
            return console.info(`Sheet with exam ${name} is already existed`);
        }
        const resource = {
            properties: {
                title: name,
            },
            sheets: [{
                properties: {
                    title: 'Rankings',
                    index: 1
                }
            },
            {
                properties: {
                    title: 'Submission',
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
            this.examService.update(examId, exam);
            if (callback && typeof callback == 'function') {
                callback();
            }
        });

    }

    updateSpreadsheet(exam: IExam, callback?: () => void) {
        const { sheetId } = exam;
        var sheets = google.sheets('v4');
        sheets.spreadsheets.values.append({
            auth: this.oAuth2Client,
            spreadsheetId: sheetId,
            range: 'Rankings!A2:B',
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [["Void", "Canvas", "Website"], ["Paul", "Shan", "Human"]]
            }
        }, (err: string, response: any) => {
            if (err) {
                return console.error(`The API returned an error: ${err}`);
            }
            if (callback && typeof callback == 'function') {
                callback();
            }
            return console.log(`Update success`)
        });
    }


}
