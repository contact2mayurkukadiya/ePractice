import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ConcessionModel, CocessionLocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { noWhitespaceValidator } from 'src/app/shared/validation';

@Component({
  selector: 'app-add-concession',
  templateUrl: './add-concession.component.html',
  styleUrls: ['./add-concession.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddConcessionComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  concessionForm: FormGroup = new FormGroup({
    concessionType: new FormControl("", [Validators.required, noWhitespaceValidator]),
    locationName: new FormControl("", Validators.required),
    isAllowAllLocation: new FormControl(false),
    isStatus: new FormControl(true)
  });

  constructor(private businessService: BusinessService,
              private appState: AppState,
              public location: Location,
              public _route: ActivatedRoute,
              public settingsService: SettingsService
    ) { 
      super(location);
  }

  ngOnInit() {
    this.businessService.getLocationsByBusiness(this.appState.userProfile.parentBusinessId).subscribe(locations => {
      this.locationList = locations;
      this._route.params.subscribe(params => {
        if(params.concessionId) {
            this.addItem = false;
            this.itemid = params.concessionId;
            this.settingsService.getConcession(this.itemid).subscribe(s => {
              this.concessionForm.patchValue(s);
              let locationName = [];
              s.concessionLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.concessionForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }


  submitConcession() {
    let concession: ConcessionModel = this.concessionForm.value;

    if(!this.concessionForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: CocessionLocation[] = [];
      if(!concession.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.concessionForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new CocessionLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.concessionId = this.itemid;
            locations.push(m);
          });
        }
      }

      concession.concessionLocation = locations;

      if(this.addItem) {
        this.settingsService.createConcessions(concession).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Concession added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding concession, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        concession.id = this.itemid;
        this.settingsService.updateConcessions(concession).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Concession updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating concession, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.concessionForm.get("locationName").clearValidators();
    }
    else {
      this.concessionForm.get("locationName").setValidators([Validators.required]);
    }
    this.concessionForm.get("locationName").updateValueAndValidity();
  }

}
