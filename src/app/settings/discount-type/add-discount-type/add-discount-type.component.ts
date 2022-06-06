import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DiscountTypeModel, DiscountTypeLocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-discount-type',
  templateUrl: './add-discount-type.component.html',
  styleUrls: ['./add-discount-type.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddDiscountTypeComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  discountTypeForm: FormGroup = new FormGroup({
    discountName: new FormControl("", [Validators.required, noWhitespaceValidator]),
    discountType: new FormControl(""),
    amount: new FormControl(0),
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
        if(params.discountTypeId) {
            this.addItem = false;
            this.itemid = params.discountTypeId;
            this.settingsService.getDiscountType(this.itemid).subscribe(s => {
              this.discountTypeForm.patchValue(s);
              let locationName = [];
              s.discountLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.discountTypeForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitDiscountType() {
    let discountType: DiscountTypeModel = this.discountTypeForm.value;

    if(!this.discountTypeForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: DiscountTypeLocation[] = [];
      if(!discountType.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.discountTypeForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new DiscountTypeLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.discountId = this.itemid;
            locations.push(m);
          });
        }
      }

      discountType.discountLocation = locations;

      if(this.addItem) {
        this.settingsService.createDiscountType(discountType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Discount Type added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding discount type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        discountType.id = this.itemid;
        this.settingsService.updateDiscountType(discountType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Discount Type updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating discount type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.discountTypeForm.get("locationName").clearValidators();
    }
    else {
      this.discountTypeForm.get("locationName").setValidators([Validators.required]);
    }
    this.discountTypeForm.get("locationName").updateValueAndValidity();
  }

}
