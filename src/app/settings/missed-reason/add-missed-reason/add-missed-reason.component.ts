import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MissedReasonModel, MissedReasonLocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-missed-reason',
  templateUrl: './add-missed-reason.component.html',
  styleUrls: ['./add-missed-reason.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddMissedReasonComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  missedReasonForm: FormGroup = new FormGroup({
    missedName: new FormControl("", [Validators.required, noWhitespaceValidator]),
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
        if(params.missedReasonId) {
            this.addItem = false;
            this.itemid = params.missedReasonId;
            this.settingsService.getMissedReason(this.itemid).subscribe(s => {
              this.missedReasonForm.patchValue(s);
              let locationName = [];
              s.missedReasonLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.missedReasonForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitMissedReason() {
    let missedReason: MissedReasonModel = this.missedReasonForm.value;

    if(!this.missedReasonForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: MissedReasonLocation[] = [];
      if(!missedReason.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.missedReasonForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new MissedReasonLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.missedReasonId = this.itemid;
            locations.push(m);
          });
        }
      }

      missedReason.missedReasonLocation = locations;

      if(this.addItem) {
        this.settingsService.createMissedReason(missedReason).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Missed Reason added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding missed reason, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        missedReason.id = this.itemid;
        this.settingsService.updateMissedReason(missedReason).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Missed Reason updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating missed reason, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.missedReasonForm.get("locationName").clearValidators();
    }
    else {
      this.missedReasonForm.get("locationName").setValidators([Validators.required]);
    }
    this.missedReasonForm.get("locationName").updateValueAndValidity();
  }

}
