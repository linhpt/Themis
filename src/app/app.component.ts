import { Component, OnInit } from '@angular/core';
var chokidar = (<any>window).require('chokidar');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  
  title = 'Themis Editor';

  ngOnInit(): void {
    var watcher = chokidar.watch(`C:\\Users\\linhp\\Documents\\personal\\testFolder`, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    
    // Something to use when events are received.
    var log = console.log.bind(console);
    // Add event listeners.
    watcher
      .on('add', path => log(`File ${path} has been added`))
      .on('change', path => log(`File ${path} has been changed`))
      .on('unlink', path => log(`File ${path} has been removed`));
    
  }
}
