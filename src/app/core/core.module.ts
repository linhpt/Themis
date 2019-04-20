import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarService } from './services/sidebar.service';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DateFormatPipe,
    SearchComponent,
    ConfirmDialogComponent
  ],
  providers: [
    SidebarService,
    DateFormatPipe,
  ],
  declarations: [HeaderComponent, FooterComponent, DateFormatPipe, ConfirmDialogComponent, SearchComponent],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class CoreModule { }
