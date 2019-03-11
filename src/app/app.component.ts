import { Component, OnInit } from '@angular/core';
import { WatcherService } from './core/services/watcher.service';
var chokidar = (<any>window).require('chokidar');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  
  title = 'Themis Editor';
  private folder = `C:\\Users\\linhp\\Google Drive (linhgando@gmail.com)\\weLinh`;

  constructor(
    private watcherService: WatcherService
  ) { }

  ngOnInit(): void {
    this.watcherService.watchFolder(this.folder);
  }
}
