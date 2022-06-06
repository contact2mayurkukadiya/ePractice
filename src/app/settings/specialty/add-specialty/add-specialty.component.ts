import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { SpecialtyModel, SpecialtyLocationModel } from 'src/app/models/app.settings.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BaseItemComponent } from '../../../shared/base-item/base-item.component';
import { LocationModel, LocationGridModel } from 'src/app/models/app.location.model';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-specialty',
  templateUrl: './add-specialty.component.html',
  styleUrls: ['./add-specialty.component.css', '../../../shared/base-item/base-item.component.css']
})

export class AddSpecialtyComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  specialtyForm: FormGroup = new FormGroup({
    specialtyName: new FormControl("", [Validators.required, noWhitespaceValidator]),
    locationName: new FormControl("", Validators.required),
    isAllowAllLocation: new FormControl(false),
    isEnableOnlineBooking: new FormControl(false),
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
        if(params.specialtyId) {
            this.addItem = false;
            this.itemid = params.specialtyId;
            this.settingsService.getSpecialty(this.itemid).subscribe(s => {
              this.specialtyForm.patchValue(s);
              let locationName = [];
              s.specialtyLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.specialtyForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitSpecialty() {
    let specialty: SpecialtyModel = this.specialtyForm.value;

    if(!this.specialtyForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: SpecialtyLocationModel[] = [];
      if(!specialty.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.specialtyForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new SpecialtyLocationModel();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.specialtyId = this.itemid;
            locations.push(m);
          });
        }
      }

      specialty.specialtyLocation = locations;

      if(this.addItem) {
        this.settingsService.createSpecialty(specialty).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Specialty added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding specialty, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        specialty.id = this.itemid;
        this.settingsService.updateSpecialty(specialty).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Specialty updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating specialty, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.specialtyForm.get("locationName").clearValidators();
    }
    else {
      this.specialtyForm.get("locationName").setValidators([Validators.required]);
    }
    this.specialtyForm.get("locationName").updateValueAndValidity();
  }
}
