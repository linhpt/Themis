import { Injectable } from '@angular/core';
const fs = (<any>window).require('fs');
const { google } = (<any>window).require('googleapis');
import * as credentials from 'src/assets/credentials.json';

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
export const TOKEN_PATH = 'token.json';


@Injectable({
    providedIn: 'root'
})
export class GspreadUtils {
    oAuth2Client: any;

    authorize() {
        const { client_secret, client_id, redirect_uris } = (<any>credentials).installed;
        this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        const token = localStorage.getItem(TOKEN_PATH);
        let res = false;
        if (token) {
            console.log('token', token);
            this.oAuth2Client.setCredentials(token);
            res = true;
        }
        return res;
    }

    generateUrl() {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        return authUrl;
    }

}
