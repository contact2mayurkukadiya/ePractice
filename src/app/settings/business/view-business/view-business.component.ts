import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-business',
  templateUrl: './view-business.component.html',
  styleUrls: ['./view-business.component.css']
})
export class ViewBusinessComponent implements OnInit {


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
  
  constructor() { }

  ngOnInit() {
  }

}
