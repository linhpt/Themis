import { Injectable, EventEmitter } from '@angular/core';
import { IContestant } from '../interfaces/core';
import * as _ from 'lodash';

const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');

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
        // remove all file from submission folder
        this.removeAllFiles();
    }

    watch() {
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
        const fileName = path.normalize(absolutePath).split('\\')[0];
        const dataPath = this.destinationFolder + fileName;
        fs.createReadStream(absolutePath)
            .pipe(fs.createWriteStream(dataPath));
    }

    private removeAllFiles() {
        fs.readdir(this.submissionFolder, (err, files) => {
            if (err) {
                throw err;
            }
            for (const file of files) {
                fs.unlink(path.join(this.submissionFolder, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
}
