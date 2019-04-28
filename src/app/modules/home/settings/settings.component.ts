import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { Location } from '@angular/common';
const remote = (<any>window).require('electron').remote;
const dialog = remote.require('electron').dialog;
const fs = (<any>window).require('fs');

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings = {
    drive: '',
    root: '',
  }

  constructor(
    private location: Location,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.sidebarService.setRoomDetailsOpen(true);
    for (var name in this.settings) {
      let itemSet = localStorage.getItem(name);
      if (itemSet) {
        this.settings[name] = itemSet;
      }
    }
  }

  onSubmit() {
    for (var name in this.settings) {
      localStorage.setItem(name, this.settings[name]);
    }
  }

  select(type: string) {
    let path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (type == 'Drive') {
      this.settings.drive = path[0];
    } else if (type == 'Root') {
      this.settings.root = path[0];
    }
  }

  back() {
    this.location.back();
  }
}
