import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { PaymentTypeModel, PaymentTypeocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-payment-type',
  templateUrl: './add-payment-type.component.html',
  styleUrls: ['./add-payment-type.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddPaymentTypeComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  paymentTypeForm: FormGroup = new FormGroup({
    paymentType: new FormControl("", [Validators.required, noWhitespaceValidator]),
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
        if(params.paymentTypeId) {
            this.addItem = false;
            this.itemid = params.paymentTypeId;
            this.settingsService.getPaymentType(this.itemid).subscribe(s => {
              this.paymentTypeForm.patchValue(s);
              let locationName = [];
              s.paymentLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.paymentTypeForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitPaymentType() {
    let paymentType: PaymentTypeModel = this.paymentTypeForm.value;

    if(!this.paymentTypeForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: PaymentTypeocation[] = [];
      if(!paymentType.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.paymentTypeForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new PaymentTypeocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.paymentId = this.itemid;
            locations.push(m);
          });
        }
      }

      paymentType.paymentLocation = locations;

      if(this.addItem) {
        this.settingsService.createPaymentType(paymentType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Payment Type added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding payment type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        paymentType.id = this.itemid;
        this.settingsService.updatePaymentType(paymentType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Payment Type updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating payment type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.paymentTypeForm.get("locationName").clearValidators();
    }
    else {
      this.paymentTypeForm.get("locationName").setValidators([Validators.required]);
    }
    this.paymentTypeForm.get("locationName").updateValueAndValidity();
  }

}
