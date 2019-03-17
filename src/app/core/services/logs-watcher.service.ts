import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const fsExtra = (<any>window).require('fs-extra');

@Injectable({
    providedIn: 'root'
})
export class LogsWatcher {
    successEvent = new EventEmitter<{}>();
    watcher: any;
    logsFolder: string;

    constructor(
    ) {
        this.logsFolder = localStorage.getItem('destinationFolder') + 'Logs';
    }

    watch() {
        fsExtra.emptyDirSync(this.logsFolder);
        this.watcher = chokidar.watch(this.logsFolder, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        this.watcher.on('add', this.readLogs);
    }

    unwatch() {
        this.watcher.unwatch(this.logsFolder);
    }

    readLogs = (absolutePath: string) => {
        let fileName = _.last(path.normalize(absolutePath).split('\\'));
        fileName = fileName.replace(/\]|\[/g, ' ');
        let tokens = fileName.split(/\s+/);

        const contestantId = +tokens[1];
        const taskName = tokens[2];

        fs.readFile(absolutePath, 'utf8', (err, content) => {
            const data = {
                contestantId,
                taskName,
                content
            }
            this.successEvent.emit(data);
        });
    }
}
