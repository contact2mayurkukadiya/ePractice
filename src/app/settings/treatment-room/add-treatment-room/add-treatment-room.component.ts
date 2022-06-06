import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { TreatmentRoomModel, TreatmentRoomLocation } from 'src/app/models/app.settings.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-treatment-room',
  templateUrl: './add-treatment-room.component.html',
  styleUrls: ['./add-treatment-room.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddTreatmentRoomComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  treatmentRoomForm: FormGroup = new FormGroup({
    treatmentType: new FormControl("", [Validators.required, noWhitespaceValidator]),
    locationName: new FormControl("", Validators.required),
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
        if(params.treatmentRoomId) {
            this.addItem = false;
            this.itemid = params.treatmentRoomId;
            this.settingsService.getTreatmentRoom(this.itemid).subscribe(t => {
              this.treatmentRoomForm.patchValue(t);
              let locationName = [];
              t.treatmentLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.treatmentRoomForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitTreatmentRoom() {
    let treatment: TreatmentRoomModel = this.treatmentRoomForm.value;

    if(!this.treatmentRoomForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: TreatmentRoomLocation[] = [];
      if(!treatment.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.treatmentRoomForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new TreatmentRoomLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.treatmentId = this.itemid;
            locations.push(m);
          });
        }
      }

      treatment.treatmentLocation = locations;

      if(this.addItem) {
        this.settingsService.createTreatmentRoom(treatment).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Treatment Room added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding treatment room, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        treatment.id = this.itemid;
        this.settingsService.updateTreatmentRoom(treatment).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Treatment Room updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating treatment room, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.treatmentRoomForm.get("locationName").clearValidators();
    }
    else {
      this.treatmentRoomForm.get("locationName").setValidators([Validators.required]);
    }
    this.treatmentRoomForm.get("locationName").updateValueAndValidity();
  }

}
