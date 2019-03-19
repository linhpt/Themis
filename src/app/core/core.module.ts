import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DexieService } from './services/db-utils/dexie.service';
import { SidebarService } from './services/sidebar.service';
import { TaskService } from './services/db-utils/task.service';
import { ContestantService } from './services/db-utils/contestant.service';
import { ExamService } from './services/db-utils/exam.service';
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
