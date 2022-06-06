import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './shared/alert/alert.component';
import { GridNoDataComponent } from './shared/grid-no-data/grid-no-data.component';
import { MatIconModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatDialogModule, MatPaginatorModule, MatButtonToggleModule } from '@angular/material';
import { ImageUploadComponent } from './shared/image-upload/image-upload.component';
import { CalendarOptionsComponent } from './settings/locations/calendar-options/calendar-options.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ContentContainerDirective } from './tools/tab-content/content-container.directive';
import { BaseGridComponent } from './shared/base-grid/base-grid.component';
import { BaseItemComponent } from './shared/base-item/base-item.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule, MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule, CalendarModule, TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { ApplicationDataComponent } from "./settings/application-data/application-data.component";
import { BlockUIModule } from 'ng-block-ui';
import {MatInputModule} from '@angular/material';
import { AddGeneralContactsComponent } from './contacts/add-general/add-general.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AddNewDropdownComponent } from './shared/add-new-dropdown/add-new-dropdown.component';
import { DialogModule } from '@progress/kendo-angular-dialog';

@NgModule({
    imports: [
    CommonModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        RouterModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        TimePickerModule,
        MatRadioModule,
        InputsModule,
        MatDialogModule,
        BlockUIModule,
        GridModule,
        DropDownsModule,
        IntlModule,
        ButtonsModule,
        DateInputsModule,
        CalendarModule,
        MatPaginatorModule,
        MatExpansionModule,
        DialogModule,
        MatButtonToggleModule,
        FormsModule
    ],
    declarations: [
        AlertComponent,
        AddGeneralContactsComponent,
        GridNoDataComponent,
        ImageUploadComponent,
        CalendarOptionsComponent,
        ContentContainerDirective,
        BaseGridComponent,
        ApplicationDataComponent,
        AddNewDropdownComponent,
        BaseItemComponent
    ],
    exports: [
        AlertComponent,
        GridNoDataComponent,
        ImageUploadComponent,
        CalendarOptionsComponent,
        ContentContainerDirective,
        BaseGridComponent,
        BaseItemComponent,
        ApplicationDataComponent,
        AddGeneralContactsComponent,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        TimePickerModule,
        MatRadioModule,
        InputsModule,
        MatDialogModule,
        GridModule,
        DropDownsModule,
        IntlModule,
        ButtonsModule,
        DateInputsModule, 
        CalendarModule,
        MatPaginatorModule,
        AddNewDropdownComponent,
        DialogModule
    ],
    bootstrap: [
        CalendarOptionsComponent
    ]
  })
  
  export class SharedModule { }