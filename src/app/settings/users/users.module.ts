import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
// import { AddUserComponent } from './addUser/addUser.component';
import { MatIconModule, MatSelectModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatDividerModule, MatMenuModule, MatListModule, MatTooltipModule, MatExpansionModule, MatDatepickerModule, MatSlideToggleModule, MatTabsModule, MatRadioModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppointmentOptionsComponent } from './appointment-options/appointment-options.component';

@NgModule({
  declarations: [
    AppointmentOptionsComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatRadioModule,
    ReactiveFormsModule,
    ColorPickerModule,
    FormsModule,
    MatInputModule
  ],
  entryComponents: [
  ]
})
export class UsersModule { }
