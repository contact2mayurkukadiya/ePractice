import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { AppointmentTypeModel, AppointmentTypeLocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-appointment-type',
  templateUrl: './add-appointment-type.component.html',
  styleUrls: ['./add-appointment-type.component.css',  '../../../shared/base-item/base-item.component.css']
})
export class AddAppointmentTypeComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  appointmentTypeForm: FormGroup = new FormGroup({
    appointmentType: new FormControl("", [Validators.required, noWhitespaceValidator]),
    locationName: new FormControl("", Validators.required),
    color:  new FormControl(""),
    isAllowAllLocation: new FormControl(false),
    isStatus: new FormControl(true)
  });

  constructor(public businessService: BusinessService,
    public appState: AppState,
    public location: Location,
    public _route: ActivatedRoute,
    public settingsService: SettingsService) { 
    super(location);
  }

  ngOnInit() {
    this.businessService.getLocationsByBusiness(this.appState.userProfile.parentBusinessId).subscribe(locations => {
      this.locationList = locations;
      this._route.params.subscribe(params => {
        if(params.appointmentTypeId) {
            this.addItem = false;
            this.itemid = params.appointmentTypeId;
            this.settingsService.getAppointmentType(this.itemid).subscribe(s => {
              this.appointmentTypeForm.patchValue(s);
              let locationName = [];
              s.appointmentTypesLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.appointmentTypeForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitAppointmentType() {
    let appointmentType: AppointmentTypeModel = this.appointmentTypeForm.value;

    if(!this.appointmentTypeForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: AppointmentTypeLocation[] = [];
      if(!appointmentType.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.appointmentTypeForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new AppointmentTypeLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.appointmentTypeId = this.itemid;
            locations.push(m);
          });
        }
      }

      appointmentType.appointmentTypesLocation = locations;

      if(this.addItem) {
        this.settingsService.createAppointmentType(appointmentType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Appointment Type added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding appointment type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        appointmentType.id = this.itemid;
        this.settingsService.updateAppointmentType(appointmentType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Appointment Type updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating appointment type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.appointmentTypeForm.get("locationName").clearValidators();
    }
    else {
      this.appointmentTypeForm.get("locationName").setValidators([Validators.required]);
    }
    this.appointmentTypeForm.get("locationName").updateValueAndValidity();
  }

}
