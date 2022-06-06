import { Component, Input, OnInit } from '@angular/core';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { Location } from '@angular/common';
import { PatientService } from 'src/app/services/app.patient.service';
import { AppState } from 'src/app/app.state';
import { FormControl, FormGroup } from '@angular/forms';
import { PatientPersonalizeModel } from 'src/app/models/app.patient.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personalize-personalize',
  templateUrl: './patient-personalize.component.html',
  styleUrls: ['./patient-personalize.component.css'],
})
export class PatientPersonalizeComponent extends BaseItemComponent implements OnInit {
  apperance = 'outline';
  @BlockUI() blockUI: NgBlockUI;
  patientPersonalize: PatientPersonalizeModel;
  patientIdForm: FormGroup = new FormGroup({
    prefix: new FormControl(''),
    suffix: new FormControl(''),
    startingNumber: new FormControl(''),
  });
  lastPatientId: string;
  preview: string;
  personalizeId: string;
  @Input() personalizeType: number;
  constructor(
    public location: Location,
    private router : Router,
    private patientService: PatientService,
    public appState: AppState
  ) {
    super(location);
  }

  ngOnInit() {
    this.preview = '';
    this.patientService
      .getLastPatientIdByLocation(this.appState.selectedUserLocation.id)
      .subscribe((data) => {
        this.lastPatientId = data;
      });

    this.patientService
      .getPersonalizeByTypeAndLocation(this.appState.selectedUserLocation.id, this.personalizeType)
      .subscribe((data) => {
        if (data.prefix !== null) {
          this.patientPersonalize = data;
          this.patientIdForm.patchValue(data);
          this.addItem = false;
          this.personalizeId = data.id;
          this.preview = data.prefix + data.startingNumber.toString() + data.suffix;
        }
      });
  }

  submitPatientId() {
    const el = document.getElementById('heading');
    const patientPersonalizeModel: PatientPersonalizeModel = this.patientIdForm
      .value;
    patientPersonalizeModel.personalizeType = this.personalizeType;
    patientPersonalizeModel.locationId = this.appState.selectedUserLocation.id;

    if (!this.patientIdForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      if (this.addItem) {
        this.patientService
          .createPatientPersonalize(patientPersonalizeModel)
          .subscribe(
            () => {
              this.submitting = false;
              this.patientService.sharedData = 'Personalize added successfully.';
              this.router.navigate(['/settings']);
              this.cancel();
              el.scrollIntoView();
              this.blockUI.stop();
            },
            () => {
              this.displayErrorMessage(
                'Error occurred while adding Patient, please try again.'
              );
              this.submitting = false;
              el.scrollIntoView();
              this.blockUI.stop();
            }
          );
      } else {
        patientPersonalizeModel.id = this.personalizeId;
        this.patientService
          .updatePatientPersonalize(patientPersonalizeModel)
          .subscribe(
            () => {
              this.submitting = false;
              this.patientService.sharedData = 'Personalize updated successfully.';
              this.router.navigate(['/settings']);
              this.cancel();
              el.scrollIntoView();
              this.blockUI.stop();
            },
            () => {
              this.displayErrorMessage(
                'Error occurred while updating Patient, please try again.'
              );
              this.submitting = false;
              el.scrollIntoView();
              this.blockUI.stop();
            }
          );
      }
    }
  }
  cancel() {}

  onChangeEvent() {
    const prefix = this.patientIdForm.get('prefix').value;
    const suffix = this.patientIdForm.get('suffix').value;
    const startingNumber = this.patientIdForm.get('startingNumber').value;
    if (prefix !== undefined && startingNumber !== undefined) {
      this.preview = prefix + startingNumber.toString() + suffix;
    }
  }
}
