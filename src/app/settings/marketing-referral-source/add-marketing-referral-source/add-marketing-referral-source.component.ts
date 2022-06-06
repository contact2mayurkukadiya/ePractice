import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MarketingSourceModel, MarketingSourceLocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-marketing-referral-source',
  templateUrl: './add-marketing-referral-source.component.html',
  styleUrls: ['./add-marketing-referral-source.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddMarketingReferralSourceComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  marketingReferralSourceForm: FormGroup = new FormGroup({
    marketingName: new FormControl("", [Validators.required, noWhitespaceValidator]),
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
        if(params.marketingReferralSourceId) {
            this.addItem = false;
            this.itemid = params.marketingReferralSourceId;
            this.settingsService.getMarketingSource(this.itemid).subscribe(s => {
              this.marketingReferralSourceForm.patchValue(s);
              let locationName = [];
              s.marketingSourceLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.marketingReferralSourceForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitMarketingReferralSource() {
    let marketingSource: MarketingSourceModel = this.marketingReferralSourceForm.value;

    if(!this.marketingReferralSourceForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: MarketingSourceLocation[] = [];
      if(!marketingSource.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.marketingReferralSourceForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new MarketingSourceLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.marketingSourceId = this.itemid;
            locations.push(m);
          });
        }
      }

      marketingSource.marketingSourceLocation = locations;

      if(this.addItem) {
        this.settingsService.createMarketingSource(marketingSource).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Marketing Referral Source added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding marketing referral source, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        marketingSource.id = this.itemid;
        this.settingsService.updateMarketingSource(marketingSource).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Marketing referral source updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating marketing referral source, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.marketingReferralSourceForm.get("locationName").clearValidators();
    }
    else {
      this.marketingReferralSourceForm.get("locationName").setValidators([Validators.required]);
    }
    this.marketingReferralSourceForm.get("locationName").updateValueAndValidity();
  }

}
