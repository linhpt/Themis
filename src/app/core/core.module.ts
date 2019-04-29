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
import { DescriptionPipe } from './pipes/description.pipe';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';

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
    DescriptionPipe,
    SearchComponent,
    AlertDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [
    SidebarService,
    DateFormatPipe,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    DateFormatPipe,
    DescriptionPipe,
    ConfirmDialogComponent,
    AlertDialogComponent,
    SearchComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    AlertDialogComponent
  ]
})
export class CoreModule { }
