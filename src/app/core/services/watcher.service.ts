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
  private log: any;

  public watchFolder(folder: string = 'None') {
    if (folder == 'None') {
      return;
    }

    this.watcher = chokidar.watch(folder, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    this.log = console.log.bind(console);
    this.watcher
      .on('add', this.onAdded)
      .on('change', this.onChanged)
      .on('unlink', this.onUnlinked);
  }

  private onAdded = (absolutePath: any) => {
    this.log(`File ${absolutePath} has been added`);
    const fname = _.last(path.normalize(absolutePath).split('\\'));
    const dataPath = `C:\\Users\\linhp\\Documents\\personal\\testFolder\\${fname}`;
    fs.createReadStream(absolutePath)
        .pipe(fs.createWriteStream(dataPath));
  }

  private onChanged = (path: any) => {
    this.log(`File ${path} has been changed`);
  }

  private onUnlinked = (path: any) => {
    this.log(`File ${path} has been removed`);
  }
}
