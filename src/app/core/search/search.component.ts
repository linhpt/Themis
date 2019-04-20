import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() reset: EventEmitter<void> = new EventEmitter<void>();
  name: string;
  constructor() { }

  ngOnInit() {
  }

  searchByName() {
    this.search.emit(this.name);
  }

  resetSearch() {
    this.name = '';
    this.reset.emit();
  }

}
