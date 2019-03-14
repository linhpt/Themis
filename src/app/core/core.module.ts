import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RoomService } from './services/room.service';
import { DexieService } from './services/dexie.service';
import { StudentService } from './services/student.service';
import { UtilsService } from './services/utils.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    UtilsService,
    StudentService,
    RoomService,
    DexieService
  ],
  declarations: [HeaderComponent, FooterComponent]
})
export class CoreModule { }
