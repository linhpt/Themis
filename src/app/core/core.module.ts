import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DexieService } from './services/dexie.service';
import { SidebarService } from './services/sidebar.service';
import { TaskService } from './services/task.service';
import { ContestantService } from './services/contestant.service';
import { ExamService } from './services/exam.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    SidebarService,
    ContestantService,
    TaskService,
    ExamService,
    DexieService
  ],
  declarations: [HeaderComponent, FooterComponent]
})
export class CoreModule { }
