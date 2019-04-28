import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  ngOnInit(): void {
  }

  message: string;
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
  }
}
