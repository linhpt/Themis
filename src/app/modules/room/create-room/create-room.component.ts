import { Component, OnInit } from '@angular/core';
import { IClass } from 'src/app/core/interfaces/core';
import { ClassService } from 'src/app/core/services/class.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {

  model: any = {};

  constructor(
    private router: Router,
    private classService: ClassService) { }

  onSubmit() {
    var now = new Date();
    const newClass: IClass = {
      name: this.model.className,
      description: this.model.classDescription,
      timeCreated: now.toString()
    }
    this.classService.add(newClass);
    this.router.navigate(['/']);
  }

}
