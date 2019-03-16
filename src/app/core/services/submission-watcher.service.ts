import { Injectable, EventEmitter } from '@angular/core';
import { IContestant } from '../interfaces/core';
import * as _ from 'lodash';

const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const fsExtra = (<any>window).require('fs-extra');

@Injectable({
    providedIn: 'root'
})
export class SubmissionWatcher {
    successEvent = new EventEmitter<boolean>();
    watcher: any;
    submissionFolder: string;
    destinationFolder: string;

    constructor(
    ) {
        this.submissionFolder = localStorage.getItem('sourceFolder');
        this.destinationFolder = localStorage.getItem('destinationFolder');
    }

    watch() {
        this.createLogs();
        fsExtra.emptyDirSync(this.submissionFolder);

        this.watcher = chokidar.watch(this.submissionFolder, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        this.watcher.on('add', this.moveToDestination);
    }

    unwatch() {
        this.watcher.unwatch(this.submissionFolder);
    }

    moveToDestination = (absolutePath: any) => {
        const fileName = _.last(path.normalize(absolutePath).split('\\'));
        const dataPath = this.destinationFolder + fileName;
        fs.createReadStream(absolutePath)
            .pipe(fs.createWriteStream(dataPath));
    }

    private createLogs() {
        let logsFolder = this.destinationFolder + 'Logs';
        if (!fs.existsSync(logsFolder)) {
            fs.mkdirSync(logsFolder);
        }
    }
}
