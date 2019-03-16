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
    successEvent = new EventEmitter<boolean>();
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
        this.watcher.on('add', () => {
            
        });
    }

    unwatch() {
        this.watcher.unwatch(this.logsFolder);
    }
}
