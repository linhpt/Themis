import { Component, OnInit } from '@angular/core';
import { IClass } from 'src/app/core/interfaces/core';
import { ClassService } from 'src/app/core/services/class.service';

@Component({
  selector: 'classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  private classList: IClass[] = [];

  constructor(
    private classService: ClassService
  ) { }

  ngOnInit() {
    this.classService.getAll().then((list: IClass[]) => {
      this.classList.push(...list);
    });
  }

}
