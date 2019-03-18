import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DexieService } from './services/dexie.service';
import { SidebarService } from './services/sidebar.service';
import { TaskService } from './services/task.service';
import { ContestantService } from './services/contestant.service';
import { ExamService } from './services/exam.service';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DateFormatPipe
  ],
  providers: [
    SidebarService,
    ContestantService,
    TaskService,
    ExamService,
    DexieService,
    DateFormatPipe
  ],
  declarations: [HeaderComponent, FooterComponent, DateFormatPipe]
})
export class CoreModule { }
