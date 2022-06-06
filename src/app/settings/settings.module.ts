import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { MatIconModule, MatSelectModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatDividerModule, MatMenuModule, MatListModule, MatTooltipModule, MatExpansionModule, MatDatepickerModule, MatSlideToggleModule, MatTabsModule, MatRadioModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule, MatButtonToggleModule, MatDialogModule, MatSliderModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IntlModule } from '@progress/kendo-angular-intl';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '../shared.modules';
import { BlockUIModule } from 'ng-block-ui';
import { OrderModule } from 'ngx-order-pipe';
import { TimePickerModule, DateInputsModule, CalendarModule } from '@progress/kendo-angular-dateinputs';
import { SettingsRoutingModule } from './settings-routing.module';
import { PersonalizeComponent } from './personalize/personalize.component';
import { PatientPersonalizeComponent } from './personalize/patient-personalize/patient-personalize.component';
import { TreatmentNotesTemplateComponent } from './treatment-notes-template/treatment-notes-template.component';
import { AddTreatmentNotesTemplateComponent } from './treatment-notes-template/add-treatment-notes-template/add-treatment-notes-template.component';
import { TemplateLibraryComponent } from './treatment-notes-template/template-library/template-library.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageFileUploadComponent } from './treatment-notes-template/image-file-upload/image-file-upload.component';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { NgxImageCompressService } from 'ngx-image-compress';
import { TreatmentNotesService } from '../services/app.treatmentnotes.services';
import { EmailtemplateComponent } from './emailtemplate/emailtemplate.component';
import { LettertemplateComponent } from './lettertemplate/lettertemplate.component';
import { AddlettertemplateComponent } from './lettertemplate/addlettertemplate/addlettertemplate.component';
import { AddemailtemplateComponent } from './emailtemplate/addemailtemplate/addemailtemplate.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CKEditorModule } from 'ckeditor4-angular';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { PopupModule } from '@progress/kendo-angular-popup';

@NgModule({
  declarations: [
    SettingsComponent,
    PersonalizeComponent,
    PatientPersonalizeComponent,
    TreatmentNotesTemplateComponent,
    AddTreatmentNotesTemplateComponent,
    TemplateLibraryComponent,
    ImageFileUploadComponent,
    EmailtemplateComponent,
    LettertemplateComponent,
    AddlettertemplateComponent,
    AddemailtemplateComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatListModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSliderModule,
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
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DateInputsModule,
    CalendarModule,
    IntlModule,
    TimePickerModule,
    InputsModule,
    MatButtonToggleModule,
    MatIconModule,
    SharedModule,
    BlockUIModule.forRoot(),
    MatDialogModule,
    OrderModule,
    LayoutModule,
    DragDropModule,
    UploadsModule,
    AngularEditorModule,
    CKEditorModule,
    TreeViewModule,
    PopupModule
  ],
  bootstrap: [
  ],
  providers: [NgxImageCompressService, TreatmentNotesService]
})
export class SettingsModule { }
