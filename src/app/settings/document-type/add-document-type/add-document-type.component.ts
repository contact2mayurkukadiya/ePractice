import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { DocumentTypeModel, DocumentTypeLocation } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { noWhitespaceValidator } from 'src/app/shared/validation';


@Component({
  selector: 'app-add-document-type',
  templateUrl: './add-document-type.component.html',
  styleUrls: ['./add-document-type.component.css', '../../../shared/base-item/base-item.component.css']
})
export class AddDocumentTypeComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  documentTypeForm: FormGroup = new FormGroup({
    folderName: new FormControl("", [Validators.required, noWhitespaceValidator]),
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
        if(params.documentTypeId) {
            this.addItem = false;
            this.itemid = params.documentTypeId;
            this.settingsService.getDocumentTypeType(this.itemid).subscribe(s => {
              this.documentTypeForm.patchValue(s);
              let locationName = [];
              s.documentTypesLocation.forEach(sl => {
                locationName.push(this.locationList.find(l => l.id == sl.locationId));
              });
              this.documentTypeForm.get("locationName").patchValue(locationName);
            });
        }
      });
    });
  }

  submitDocumentType() {
    let documentType: DocumentTypeModel = this.documentTypeForm.value;

    if(!this.documentTypeForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      let locations: DocumentTypeLocation[] = [];
      if(!documentType.isAllowAllLocation) {
        let locationSelections: LocationGridModel[] = this.documentTypeForm.get("locationName").value;
        if(locationSelections) {
          locationSelections.forEach(l => {
            let m = new DocumentTypeLocation();
            m.locationId = l.id;
            m.locationName = l.locationName;
            m.documentTypeId = this.itemid;
            locations.push(m);
          });
        }
      }

      documentType.documentTypesLocation = locations;

      if(this.addItem) {
        this.settingsService.createDocumentTypeType(documentType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Document Type added successfully.");
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding document type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        documentType.id = this.itemid;
        this.settingsService.updateDocumentTypeType(documentType).subscribe(d => {
          this.submitting = false;
          this.displaySuccessMessage("Document Type updated successfully.");
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating document type, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }

  onApplyLocationChanged(event) {
    if(event === true) {
      this.documentTypeForm.get("locationName").clearValidators();
    }
    else {
      this.documentTypeForm.get("locationName").setValidators([Validators.required]);
    }
    this.documentTypeForm.get("locationName").updateValueAndValidity();
  }

}
