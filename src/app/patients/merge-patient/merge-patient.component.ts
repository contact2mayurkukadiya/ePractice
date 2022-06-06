import { Component, OnInit } from '@angular/core';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Location } from '@angular/common';
import {
  MergePatientModel,
  MergePatientsModel,
  PatientModel,
} from 'src/app/models/app.patient.model';
import { PatientService } from 'src/app/services/app.patient.service';

@Component({
  selector: 'app-merge-patient',
  templateUrl: './merge-patient.component.html',
  styleUrls: ['./merge-patient.component.css'],
})
export class MergePatientComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  apperance = 'outline';
  patients: MergePatientModel[] = [];
  originalPatients: MergePatientModel[];
  duplicatePatients: MergePatientModel[];

  duplicateImage: string;
  duplicateName: string;
  duplicateId: string;
  duplicatePatientId: string;
  duplicateDOB: string;
  duplicatePhoneNo: string;
  duplicateMobileNo: string;
  duplicateEmailId: string;
  duplicateAdress: string;
  duplicateTotalAppointments: string;
  duplicateTotalOutstanding: string;
  originalImage: string;
  originalName: string;
  originalId: string;
  originalPatientId: string;
  originalDOB: string;
  originalPhoneNo: string;
  originalMobileNo: string;
  originalEmailId: string;
  originalAdress: string;
  originalTotalAppointments: string;
  originalTotalOutstanding: string;
  public opened = false;

  handleOriginalFilter(value) {
    if (this.duplicateId !== '') {
      this.originalPatients = this.patients.filter(
        (s) =>
          s.id !== this.duplicateId &&
          s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.originalPatients = this.patients.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
  }

  handleDuplicateFilter(value) {
    if (this.originalId !== '') {
      this.duplicatePatients = this.patients.filter(
        (s) =>
          s.id !== this.originalId &&
          s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.duplicatePatients = this.patients.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
  }

  handleOriginalChange(value) {
    if (value !== undefined) {
      const patient = this.patients.find((x) => (x.id === value));
      this.originalImage = patient.image;
      this.originalName = patient.name;
      this.originalId = patient.id;
      this.originalPatientId = patient.patientId;
      this.originalDOB = patient.dob;
      this.originalPhoneNo = patient.phone;
      this.originalMobileNo = patient.mobile;
      this.originalEmailId = patient.email;
      this.originalAdress = patient.address;
      this.originalTotalAppointments = patient.totalAppointments;
      this.originalTotalOutstanding = patient.totalOutstanding;

      if (this.originalId !== undefined) {
        this.duplicatePatients = this.patients.filter(
          (s) => s.id !== this.originalId
        );
      }
    } else {
      this.originalImage = '';
      this.originalName = '';
      this.originalId = undefined;
      this.originalPatientId = '';
      this.originalDOB = '';
      this.originalPhoneNo = '';
      this.originalMobileNo = '';
      this.originalEmailId = '';
      this.originalAdress = '';
      this.originalTotalAppointments = '';
      this.originalTotalOutstanding = '';
      this.duplicatePatients = this.patients;
    }
  }

  handleDuplicateChange(value) {
    if (value !== undefined) {
      const patient = this.patients.find((x) => (x.id === value));
      this.duplicateImage = patient.image;
      this.duplicateName = patient.name;
      this.duplicateId = patient.id;
      this.duplicatePatientId = patient.patientId;
      this.duplicateDOB = patient.dob;
      this.duplicatePhoneNo = patient.phone;
      this.duplicateMobileNo = patient.mobile;
      this.duplicateEmailId = patient.email;
      this.duplicateAdress = patient.address;
      this.duplicateTotalAppointments = patient.totalAppointments;
      this.duplicateTotalOutstanding = patient.totalOutstanding;

      if (this.duplicateId !== undefined) {
        this.originalPatients = this.patients.filter(
          (s) => s.id !== this.duplicateId
        );
      }
    } else {
      this.duplicateImage = '';
      this.duplicateName = '';
      this.duplicateId = undefined;
      this.duplicatePatientId = '';
      this.duplicateDOB = '';
      this.duplicatePhoneNo = '';
      this.duplicateMobileNo = '';
      this.duplicateEmailId = '';
      this.duplicateAdress = '';
      this.duplicateTotalAppointments = '';
      this.duplicateTotalOutstanding = '';
      this.originalPatients = this.patients;
    }
  }

  constructor(
    public location: Location,
    private patientService: PatientService,
    private router: Router
  ) {
    super(location);
  }

  ngOnInit() {
    this.populateLanding();
  }

  populateLanding() {
    this.blockUI.start();
    this.patientService.getAllPatients().subscribe((data) => {
      if (data.length > 0) {
        data.map((model: PatientModel) => {
          const m = new MergePatientModel();
          m.image = model.patientPhoto;
          m.id = model.id;
          m.patientId = model.patientId;
          m.name = model.firstName + ' ' + model.lastName;
          m.gender = model.gender;
          m.dob = model.dob;
          m.phone = model.homePhone;
          m.mobile = model.mobile;
          m.address =
            model.address +
            ' ' +
            model.city +
            ' ' +
            model.state +
            ' ' +
            model.postCode;
          m.email = model.email;
          m.totalAppointments = '10';
          m.totalOutstanding = 'AUD 100';
          this.patients.push(m);
        });
      }
      this.originalPatients = this.patients;
      this.duplicatePatients = this.patients;
    });
    this.blockUI.stop();
  }

  cancel() {
    this.displayErrorMessage(
      'Error occurred while adding Patient, please try again.'
    );
  }
  submitMergePatient() {
    this.opened = true;
  }
  close() {
    this.opened = false;
  }
  processMergePatient() {
    const merge = new MergePatientsModel();
    merge.duplicateId = this.duplicateId;
    merge.originalId = this.originalId;
    this.patientService
      .mergePatient(merge)
      .subscribe(
        () => {
          this.patientService.sharedData =
            'your request to merge duplicate patient records to original patient is successfully completed.';
          this.router.navigate(['/patients/edit/' + this.originalId]);
          this.blockUI.stop();
        },
        () => {
          this.opened = false;
          this.displayErrorMessage(
            'Error occurred while merging Patient, please try again.'
          );
          this.blockUI.stop();
        }
      );
  }
}
