import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings: {
    sourceFolder: string;
    destinationFolder: string;
    examFolder: string;
  } = {
      sourceFolder: '',
      destinationFolder: '',
      examFolder: ''
    }

  constructor(
    private router: Router,
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
    this.back();
  }

  back() {
    this.location.back();
  }
}
