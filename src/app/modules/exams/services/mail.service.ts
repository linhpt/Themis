import { Injectable } from '@angular/core';
import { IMailer } from '../models/item.models';
const nodemailer = (<any>window).require("nodemailer");

@Injectable({
    providedIn: 'root'
})
export class MailService {

    readonly SERVICE = 'gmail';
    readonly USER = 'int10041n3@gmail.com';
    readonly PASSWD = 'tinhoccoso';

    transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: this.SERVICE,
            auth: {
                user: this.USER,
                pass: this.PASSWD
            }
        });

    }

    async sendMail(content: IMailer) {
        await this.transporter.sendMail(content);
    }
}
