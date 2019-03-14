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
  private folder = localStorage.getItem('sourceFolder');

  constructor(
    private weLinhService: WatcherService,
  ) { }

  ngOnInit(): void {
    this.weLinhService.watchFolder(this.folder);
  }
}
