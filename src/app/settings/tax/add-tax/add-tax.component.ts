import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { TaxLocationModel, TaxModel } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddTaxComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  taxForm: FormGroup = new FormGroup({
    taxType: new FormControl("", [Validators.required, noWhitespaceValidator]),
    isAllowAllLocation: new FormControl(false),
    locationName: new FormControl("", Validators.required),
    taxRate: new FormControl(0, Validators.required),
    isStatus: new FormControl(true)
  });

  constructor(private businessService: BusinessService,
    private appState: AppState,
    public location: Location,
    public _route: ActivatedRoute,
    public settingsService: SettingsService) {
    super(location);
  }

  ngOnInit() {
    this.businessService.getLocationsByBusiness(this.appState.userProfile.parentBusinessId).subscribe(locations => {
      this.locationList = locations;
      this._route.params.subscribe(params => {
        if (params.taxId) {
          this.addItem = false;
          this.itemid = params.taxId;
          this.settingsService.getTax(this.itemid).subscribe(s => {
            this.taxForm.patchValue(s);
            let locationName = [];
            s.taxLocation.forEach(sl => {
              locationName.push(this.locationList.find(l => l.id == sl.locationId));
            });
            this.taxForm.get("locationName").patchValue(locationName);
          });
        }
      });
    });
  }

  submitTax() {
    let tax: TaxModel = this.taxForm.value;
    if (!this.taxForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: TaxLocationModel[] = [];
      if (!tax.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.taxForm.get("locationName").value;
        if (locationSelections) {
          locationSelections.forEach(l => {
            let m = new TaxLocationModel();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.taxId = this.itemid;
            locations.push(m);
          });
        }
      }

      tax.taxLocation = locations;
      tax.taxRate = parseFloat(this.taxForm.get("taxRate").value);

      if (this.addItem) {
        this.settingsService.createTax(tax).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Tax added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding tax, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        tax.id = this.itemid;

        this.settingsService.updateTax(tax).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Tax updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating tax, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if (event === true) {
      this.taxForm.get("locationName").clearValidators();
    }
    else {
      this.taxForm.get("locationName").setValidators([Validators.required]);
    }
    this.taxForm.get("locationName").updateValueAndValidity();
  }

}
