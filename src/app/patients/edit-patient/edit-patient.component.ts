import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PatientTab } from 'src/app/models/app.patient.model';
import { PatientContactComponent } from '../patient-contact/patient-contact.component';
import { PatientCaseComponent } from '../patient-case/patient-case.component';
import { PatientAppointmentsComponent } from '../patient-appointments/patient-appointments.component';
import { PatientTreatmentnotesComponent } from '../patient-treatmentnotes/patient-treatmentnotes.component';
import { PatientLettersComponent } from '../patient-letters/patient-letters.component';
import { PatientBillingComponent } from '../patient-billing/patient-billing.component';
import { PatientAlertrecallComponent } from '../patient-alertrecall/patient-alertrecall.component';
import { PatientCommmunicationsComponent } from '../patient-commmunications/patient-commmunications.component';
import { PatientDocumentsComponent } from '../patient-documents/patient-documents.component';
import { PatientDetailsComponent } from '../patient-details/patient-details.component';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css'],
})
export class EditPatientComponent extends BaseItemComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: true })
  image: ImageUploadComponent;
  @BlockUI() blockUI: NgBlockUI;
  apperance = 'outline';
  addPatient = true;
  patientId: any;

  patientTabs: PatientTab[] = [
    {
      active: true,
      component: PatientDetailsComponent,
      title: 'Details',
      addUrl: '/patients/details',
    },
    {
      active: true,
      component: PatientContactComponent,
      title: 'Contacts',
      addUrl: '/patients/contacts',
    },
    {
      active: true,
      component: PatientCaseComponent,
      title: 'Case',
      addUrl: '/patients/case',
    },
    {
      active: true,
      component: PatientAppointmentsComponent,
      title: 'Appointments',
      addUrl: '/patients/appointments',
    },
    {
      active: true,
      component: PatientTreatmentnotesComponent,
      title: 'Treatment Notes',
      addUrl: '/patients/treatmentnotes',
    },
    {
      active: true,
      component: PatientLettersComponent,
      title: 'Letters',
      addUrl: '/patients/letters',
    },
    {
      active: true,
      component: PatientBillingComponent,
      title: 'Billing',
      addUrl: '/patients/billing',
    },
    {
      active: true,
      component: PatientAlertrecallComponent,
      title: 'Alert & Recall',
      addUrl: '/patients/alertrecall',
    },
    {
      active: true,
      component: PatientCommmunicationsComponent,
      title: 'Commmunications',
      addUrl: '/patients/commmunications',
    },
    {
      active: true,
      component: PatientDocumentsComponent,
      title: 'Documents',
      addUrl: '/patients/documents',
    },
  ];

  constructor(
    public businessService: BusinessService,
    public appState: AppState,
    public location: Location,
    public _route: ActivatedRoute
  ) {
    super(location);
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      if (params.patientId) {
        this.blockUI.start();
        this.addPatient = false;
        this.patientId = params.patientId;
        this.blockUI.stop();
      }
    });
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedTabState.next(tabChangeEvent.index);
  }
}
