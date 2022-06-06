import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, MatSelectChange } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CalendarOptionsComponent } from '../calendar-options/calendar-options.component';
import { ActivatedRoute } from '@angular/router';
import { ImageSnippet, MessageType } from 'src/app/models/app.misc';
import { LocationModel } from 'src/app/models/app.location.model';
import { MiscService } from 'src/app/services/app.misc.service';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(ImageUploadComponent, { static: true }) image : ImageUploadComponent;
  public steps: any = { hour: 0, minute: 15, second: 0 };

  locationForm: FormGroup = new FormGroup({
    locationName: new FormControl("", Validators.required),
    locationLogo: new FormControl(""),
    emailId: new FormControl("", [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]),
    locationRegistrationName: new FormControl(""),
    locationRegistrationNo: new FormControl(""),
    contactPerson: new FormControl(""),
    address1: new FormControl(""),
    address2: new FormControl(""),
    country: new FormControl("Australia"),
    state: new FormControl(""),
    city: new FormControl(""),
    postCode: new FormControl(""),
    phone: new FormControl(""),
    mobile: new FormControl(""),
    fax: new FormControl(""),
    website: new FormControl("", Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")),
    status: new FormControl(true),
    isDefault: new FormControl(false),
    bankName: new FormControl(""),
    bsbNumber: new FormControl(""),
    accountNumber: new FormControl(""),
    invoiceTerms: new FormControl(""),
    notes: new FormControl(""),
    timeZone: new FormControl(""),
    startTime: new FormControl(null),
    endTime: new FormControl(null),
    timeSlot: new FormControl(""),
    timeSlotSize: new FormControl(""),
    calendarColor: new FormControl("#ffffff"),
    isDoubleBooking: new FormControl(true),
    isPatientOnlineBooking: new FormControl(true)
  });

  apperance: string = "outline";

  countries: any[];
  timezone: any[];
  clickedCalendarOptions: boolean = false;

  constructor(private businessService: BusinessService,
              private appState: AppState,
              public location: Location,
              public dialog: MatDialog,
              private _route: ActivatedRoute,
              private miscService: MiscService
    ) { 
      super(location);
  }

  ngOnInit() {    
    this.miscService.getCountries().subscribe(countries => {
      this.countries = countries;
    });

    this._route.params.subscribe(params => {
      if(params.locationId) {
        this.blockUI.start();
        this.addItem = false;
        this.itemid = params.locationId;
        this.clickedCalendarOptions = true;

        this.businessService.getLocation(params.locationId).subscribe(data => {
          if(data.startTime) {
            data.startTime = new Date(data.startTime);
          }
          if(data.endTime) {
            data.endTime = new Date(data.endTime);
          }

          this.locationForm.patchValue(data);
          if(data.locationLogo) {
            this.image.selectedFile = new ImageSnippet(`data:image/jpeg;base64,${data.locationLogo}`, null); 
          }
          this.blockUI.stop();          
        });
      }
      else {
        this.populateDefaultValues(); 
      }
    });
  }

  populateDefaultValues() {
    this.locationForm.get("isDoubleBooking").patchValue(false);
    this.locationForm.get("isPatientOnlineBooking").patchValue(false);
    let start = new Date();
    start.setHours(8);
    start.setMinutes(0);
    let end = new Date();
    end.setHours(17);
    end.setMinutes(0);
    this.locationForm.get("startTime").patchValue(start);
    this.locationForm.get("endTime").patchValue(end);
  }

  openDialog(event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(CalendarOptionsComponent, {
      width: '1200px'
    });

    let instance = dialogRef.componentInstance;
    instance.formGroup = this.locationForm;

    dialogRef.afterClosed().subscribe(result => {      
      this.clickedCalendarOptions = true;
    });
  }
  
  createlocation() {
    let el = document.getElementById("heading");
    let locationUpdate: LocationModel = this.locationForm.value;

    if(!this.locationForm.invalid) {
      this.blockUI.start();
      this.submitting = true;;

      if(this.image.selectedFile) {
        locationUpdate.locationLogo = this.image.selectedFile.src.replace('data:', '').replace(/^.+,/, '');;
      }

      if(this.addItem) {
        this.businessService.addLocation(locationUpdate).subscribe(data => {
          this.submitting = false;
          this.displaySuccessMessage("Location added successfully.");
          el.scrollIntoView();
          this.blockUI.stop();
          this.itemid = data;
          this.addItem = false;
        }, error => {
          this.displayErrorMessage("Error occurred while adding location, please try again.");
          this.submitting = false;
          el.scrollIntoView();
          this.blockUI.stop();
        });
      }
      else {
        locationUpdate.id = this.itemid;
        this.businessService.updateLocation(locationUpdate).subscribe(data => {
          this.submitting = false;
          this.displaySuccessMessage("Location updated successfully.");
          el.scrollIntoView();
          this.blockUI.stop();
        }, error => {
          this.displayErrorMessage("Error occurred while updating location, please try again.");
          this.submitting = false;
          el.scrollIntoView();
          this.blockUI.stop();
        });
      }
    }
  }
}
