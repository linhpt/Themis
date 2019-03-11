import { Injectable } from '@angular/core';
var chokidar = (<any>window).require('chokidar');

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

  private onAdded = (path: any) => {
    this.log(`File ${path} has been added`);
  }

  private onChanged = (path: any) => {
    this.log(`File ${path} has been changed`);
  }

  private onUnlinked = (path: any) => {
    this.log(`File ${path} has been removed`);
  }
}
