import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  model: {
    sourceFolder: string;
    destinationFolder: string;
    spreadsheetId: string;
    studentFolder: string;
    taskFolder: string;
    logsFolder: string;
  } = {
    sourceFolder: '',
    destinationFolder: '',
    spreadsheetId: '',
    studentFolder: '',
    taskFolder: '',
    logsFolder: ''
  }

  constructor(
    private router: Router,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.utilsService.setRoomDetailsOpen(true);
    for (var name in this.model) {
      let itemSet = localStorage.getItem(name);
      if (itemSet) {
        this.model[name] = itemSet;
      }
    }
  }

  onSubmit() {
    for (var name in this.model) {
      localStorage.setItem(name, this.model[name]);
    }
    this.router.navigate(['/']);
  }

}
