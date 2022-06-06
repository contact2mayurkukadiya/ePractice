import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
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
  MatFormFieldModule,
  MatTableModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatProgressBarModule
} from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { IntlModule } from '@progress/kendo-angular-intl';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '../shared.modules';
import { BlockUIModule } from 'ng-block-ui';
import { OrderModule } from 'ngx-order-pipe';
import {
  TimePickerModule,
  DateInputsModule,
  CalendarModule,
} from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { PatientContactComponent } from './patient-contact/patient-contact.component';
import { PatientCaseComponent } from './patient-case/patient-case.component';
import { PatientAppointmentsComponent } from './patient-appointments/patient-appointments.component';
import { PatientTreatmentnotesComponent } from './patient-treatmentnotes/patient-treatmentnotes.component';
import { PatientLettersComponent } from './patient-letters/patient-letters.component';
import { PatientBillingComponent } from './patient-billing/patient-billing.component';
import { PatientAlertrecallComponent } from './patient-alertrecall/patient-alertrecall.component';
import { PatientCommmunicationsComponent } from './patient-commmunications/patient-commmunications.component';
import { PatientDocumentsComponent } from './patient-documents/patient-documents.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientTabContentComponent } from './patient-tab-content/patient-tab-content.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientSummaryComponent } from './patient-summary/patient-summary.component';
import { PatientControlComponent } from './patient-control/patient-control.component';
import { MergePatientComponent } from './merge-patient/merge-patient.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { AdddocumentsComponent } from './adddocuments/adddocuments.component';
import { EmailtemplateComponent } from './emailtemplate/emailtemplate.component';
import { PreviewdocumentComponent } from './previewdocument/previewdocument.component';
// import { ImgViewerModule } from 'ng-picture-viewer';
import { NgImageFullscreenViewModule } from "ng-image-fullscreen-view";
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AddTreatmentNotesComponent } from './add-treatment-notes/add-treatment-notes.component';
import { EditorModule } from '@progress/kendo-angular-editor';
import { MaterialTimePickerModule } from '../material-timepicker/material-timepicker.module';
import { MatSliderModule } from '@angular/material/slider';
import { BodyChartComponent } from './patient-treatmentnotes/body-chart/body-chart.component';
import { SpineChartComponent } from './patient-treatmentnotes/spine-chart/spine-chart.component';
@NgModule({
  declarations: [
    PatientsComponent,
    AddPatientComponent,
    PatientDetailsComponent,
    PatientContactComponent,
    PatientCaseComponent,
    PatientAppointmentsComponent,
    PatientTreatmentnotesComponent,
    PatientLettersComponent,
    PatientBillingComponent,
    PatientAlertrecallComponent,
    PatientCommmunicationsComponent,
    PatientDocumentsComponent,
    PatientTabContentComponent,
    EditPatientComponent,
    PatientSummaryComponent,
    PatientControlComponent,
    MergePatientComponent,
    AdddocumentsComponent,
    EmailtemplateComponent,
    PreviewdocumentComponent,
    AddTreatmentNotesComponent,
    BodyChartComponent,
    SpineChartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PatientsRoutingModule,
    MatListModule,
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
    BlockUIModule.forRoot(),
    MatDialogModule,
    OrderModule,
    LayoutModule,
    InputsModule,
    DialogModule,
    MatProgressBarModule,
    NgImageFullscreenViewModule,
    DropDownsModule,
    ProgressBarModule,
    TooltipModule,
    EditorModule,
    MaterialTimePickerModule,
    MatSliderModule
    // ImgViewerModule
  ],
  entryComponents: [
    AddPatientComponent,
    PatientDetailsComponent,
    PatientContactComponent,
    PatientCaseComponent,
    PatientAppointmentsComponent,
    PatientTreatmentnotesComponent,
    PatientLettersComponent,
    PatientBillingComponent,
    PatientAlertrecallComponent,
    PatientCommmunicationsComponent,
    PatientDocumentsComponent,
    AdddocumentsComponent,
    EmailtemplateComponent,
    PreviewdocumentComponent,
    AddTreatmentNotesComponent
  ]
})
export class PatientsModule { }
