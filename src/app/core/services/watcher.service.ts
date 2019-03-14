import { Injectable } from '@angular/core';
import * as _ from 'lodash';

const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');

const { remote } = (<any>window).require('electron');
const appPath = remote.app.getAppPath();

@Injectable({
  providedIn: 'root'
})
export class WatcherService {
  private watcher: any;

  public watchFolder(folder: string) {
    this.watcher = chokidar.watch(folder, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    this.watcher.on('add', this.moveToDestinationPath)
  }

  private moveToDestinationPath = (absolutePath: any) => {
    const fileName = _.last(path.normalize(absolutePath).split('\\'));
    const dataPath = localStorage.getItem('destinationPath') + fileName;
    fs.createReadStream(absolutePath)
        .pipe(fs.createWriteStream(dataPath));
  }
}
