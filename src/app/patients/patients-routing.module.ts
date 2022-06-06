import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { MergePatientComponent } from './merge-patient/merge-patient.component';
const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      {
        path: 'add',
        component: AddPatientComponent,
      },
      {
        path: 'patients/:patientId',
        component: AddPatientComponent,
      },
      {
        path: 'merge',
        component: MergePatientComponent,
      },
      {
        path: 'edit/:patientId',
        component: EditPatientComponent,
      },
      {
        path: 'details',
        component: PatientDetailsComponent,
      },
      {
        path: 'contacts',
        component: PatientContactComponent,
      },
      {
        path: 'case',
        component: PatientCaseComponent,
      },
      {
        path: 'appointments',
        component: PatientAppointmentsComponent,
      },
      {
        path: 'treatmentnotes',
        component: PatientTreatmentnotesComponent,
      },
      {
        path: 'letters',
        component: PatientLettersComponent,
      },
      {
        path: 'billing',
        component: PatientBillingComponent,
      },
      {
        path: 'alertrecall',
        component: PatientAlertrecallComponent,
      },
      {
        path: 'Commmunications',
        component: PatientCommmunicationsComponent,
      },
      {
        path: 'documents',
        component: PatientDocumentsComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule { }
