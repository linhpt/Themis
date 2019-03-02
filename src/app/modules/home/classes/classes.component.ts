import { Component, OnInit } from '@angular/core';
import { IClass } from 'src/app/core/interfaces/core';
import { ClassService } from 'src/app/core/services/class.service';
import { Router } from '@angular/router';

@Component({
  selector: 'classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {

  private classList: IClass[] = [];

  constructor(
    private classService: ClassService,
    private router: Router
  ) { }

  ngOnInit() {
    this.classService.getAll().then((list: IClass[]) => {
      this.classList.push(...list);
    });
  }

  view(cls: IClass) {
    this.router.navigate(['/room/room-details', cls.id]);
  }

  remove(cls: IClass) {
    
  }

}
