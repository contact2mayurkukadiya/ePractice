import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dt-format';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { ImageSnippet, MessageType } from 'src/app/models/app.misc';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MiscService } from 'src/app/services/app.misc.service';


@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class EditBusinessComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(ImageUploadComponent, { static: true }) image : ImageUploadComponent;

  message: string;
  type: MessageType;

  color: any;

  countries: any[];

  submitting: boolean = false;
  public steps: any = { hour: 0, minute: 30, second: 0 };

  businessForm: FormGroup = new FormGroup({
    businessName: new FormControl("", Validators.required),
    businessLogo: new FormControl(""),
    emailId: new FormControl("", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    businessRegistrationName: new FormControl(""),
    businessRegistrationNo: new FormControl(""),
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
    calendarColor: new FormControl("#8b2e2e"),
    isDoubleBooking: new FormControl(true),
    isPatientOnlineBooking: new FormControl(true)
  });

  apperance: string = "outline";

  constructor(private businessService: BusinessService,
              private appState: AppState,
              private location: Location,
              private miscService: MiscService
    ) { }

  ngOnInit() {
    this.blockUI.start();

    this.miscService.getCountries().subscribe(countries => {
      this.countries = countries;
    });


    this.businessService.getParentBusiness(this.appState.UserProfile.parentBusinessId).subscribe(data => {
      if(data.startTime) {
        data.startTime = new Date(data.startTime);
      }
      else {
        let start = new Date();
        start.setHours(8);
        start.setMinutes(0);
        data.startTime = start;
      }

      if(data.endTime) {
        data.endTime = new Date(data.endTime);
      }
      else {
        let end = new Date();
        end.setHours(17);
        end.setMinutes(0);
        data.endTime = end;
      }

      // data.status = data.status ? "active" : "inactive";

      if(!data.country) {
        //todo: map this to location service
        data.country = "Australia";
      }

      if(data.businessLogo) {
        this.image.selectedFile = new ImageSnippet(`data:image/jpeg;base64,${data.businessLogo}`, null); 
      }

      this.businessForm.patchValue(data);
      this.blockUI.stop();
    });
  }


  
  createBusiness() {
    let el = document.getElementById("heading");
    if(!this.businessForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      // this.businessForm.value.status = this.businessForm.value.status == "active";

      if(this.image.selectedFile) {
        this.businessForm.value.businessLogo = this.image.selectedFile.src.replace('data:', '').replace(/^.+,/, '');;
      }

      this.businessService.updateBusiness(this.businessForm.value).subscribe(data => {
        this.submitting = false;
        this.message = "Business updated successfully.";
        this.type = MessageType.success;
        el.scrollIntoView();
        this.blockUI.stop();
      }, error => {
        this.message = "Error occurred while updating business, please try again.";
        this.type = MessageType.error;
        this.submitting = false;
        el.scrollIntoView();
        this.blockUI.stop();
      });
    }
  }

  cancel() {
    this.location.back();
  }

}
