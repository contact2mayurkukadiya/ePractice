import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dt-format';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AddBusinessComponent implements OnInit {
  color: any;

  businessForm: FormGroup = new FormGroup({
    businessName: new FormControl("", Validators.required),
    businessLogo: new FormControl(""),
    emailId: new FormControl("", Validators.required),
    businessRegistrationName: new FormControl(""),
    businessRegistrationNo: new FormControl(""),
    contactPerson: new FormControl(""),
    address1: new FormControl(""),
    address2: new FormControl(""),
    country: new FormControl(""),
    state: new FormControl(""),
    city: new FormControl(""),
    postCode: new FormControl(""),
    phone: new FormControl(""),
    mobile: new FormControl(""),
    fax: new FormControl(""),
    website: new FormControl(""),
    status: new FormControl(true),
    isDefault: new FormControl(false),
    timeZone: new FormControl(""),
    startTime: new FormControl(""),
    endTime: new FormControl(""),
    timeSlot: new FormControl(""),
    timeSlotSize: new FormControl(""),
    calendarColor: new FormControl("#8b2e2e"),
    isDoubleBooking: new FormControl(true),
    isPatientOnlineBooking: new FormControl(true),
    createdBy: new FormControl(""),
    createdDate: new FormControl(""),
    modifiedBy: new FormControl(""),
    modifiedDate: new FormControl(""),
  });

  apperance: string = "outline";

  constructor() { }

  ngOnInit() {
  }

  createBusiness() {    

  }

}
