import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import { MaterialTimePickerComponent } from './material-timepicker-component/material-timepicker.component';
import { NgModule } from '@angular/core';
import { WClockComponent } from './w-clock/w-clock.component';
import { WTimeComponent } from './w-time/w-time.component';
import { WTimeDialogComponent } from './w-time-dialog/w-time-dialog.component';

@NgModule({
  declarations: [
    MaterialTimePickerComponent,
    WTimeDialogComponent,
    WClockComponent,
    WTimeComponent,
  ],
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    MaterialTimePickerComponent,
    WTimeDialogComponent,
    WClockComponent,
    WTimeComponent,
  ],
  entryComponents: [
    MaterialTimePickerComponent,
    WTimeDialogComponent,
    WClockComponent,
    WTimeComponent,
  ]
})
export class MaterialTimePickerModule { }