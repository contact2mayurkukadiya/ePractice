import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { CancelReasonModel, CancelReasonLocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-cancel-reason',
  templateUrl: './add-cancel-reason.component.html',
  styleUrls: ['./add-cancel-reason.component.css',  '../../../shared/base-item/base-item.component.css']
})
export class AddCancelReasonComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  cancelReasonForm: FormGroup = new FormGroup({
    cancelName: new FormControl("", [Validators.required, noWhitespaceValidator]),
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
        if(params.cancelReasonId) {
            this.addItem = false;
            this.itemid = params.cancelReasonId;
            this.settingsService.getCancelReason(this.itemid).subscribe(s => {
              this.cancelReasonForm.patchValue(s);
              let locationName = [];
              s.cancelReasonLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.cancelReasonForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitCancelReason() {
    let cancelReason: CancelReasonModel = this.cancelReasonForm.value;

    if(!this.cancelReasonForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: CancelReasonLocation[] = [];
      if(!cancelReason.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.cancelReasonForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new CancelReasonLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.cancelReasonId = this.itemid;
            locations.push(m);
          });
        }
      }

      cancelReason.cancelReasonLocation = locations;

      if(this.addItem) {
        this.settingsService.createCancelReason(cancelReason).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Cancel reason added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding cancel reason, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        cancelReason.id = this.itemid;
        this.settingsService.updateCancelReason(cancelReason).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Cancel reason updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating cancel reason, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.cancelReasonForm.get("locationName").clearValidators();
    }
    else {
      this.cancelReasonForm.get("locationName").setValidators([Validators.required]);
    }
    this.cancelReasonForm.get("locationName").updateValueAndValidity();
  }
}
