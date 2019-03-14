import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  model: {
    sourceFolder: string;
    destinationFolder: string;
    excelPath: string;
    studentFolder: string;
    taskFolder: string;
    logsFolder: string;
  } = {
    sourceFolder: '',
    destinationFolder: '',
    excelPath: '',
    studentFolder: '',
    taskFolder: '',
    logsFolder: ''
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    for (var name in this.model) {
      localStorage.setItem(name, this.model[name]);
    }
    this.router.navigate(['/']);
  }

}
