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
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DateFormatPipe,
    ConfirmDialogComponent
  ],
  providers: [
    SidebarService,
    ContestantService,
    TaskService,
    ExamService,
    DexieService,
    DateFormatPipe
  ],
  declarations: [HeaderComponent, FooterComponent, DateFormatPipe, ConfirmDialogComponent],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class CoreModule { }
