import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dt-format';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { MessageType } from 'src/app/models/app.misc';
import { AppointmentService } from '../appointment.service';
import { Practitioner } from './../appointment.service';

@Component({
  selector: 'app-create-practitioner',
  templateUrl: './create-practitioner.component.html',
  styleUrls: ['./create-practitioner.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class CreatePractitionerComponent implements OnInit {
  @ViewChild(ImageUploadComponent, { static: true }) image: ImageUploadComponent;

  message: string;
  type: MessageType;

  color: any;

  countries: any[];

  submitting: boolean = false;
  public steps: any = { hour: 0, minute: 30, second: 0 };

  businessForm: FormGroup = new FormGroup({
    position: new FormControl("web developer", Validators.required),
    phone: new FormControl("7878333456"),
    mobile: new FormControl("9756248563"),
    emailId: new FormControl("demo@gmail.com", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    location: new FormControl(['surat'], Validators.required),
    speciality: new FormControl("Neurology", Validators.required),
    providerNumber: new FormControl("1", Validators.required),
    otherIds: new FormControl("1"),
    calenderAccess: new FormControl(false),
    title: new FormControl("Practitioner"),
    gender: new FormControl("male"),
    firstName: new FormControl("Mayur", Validators.required),
    lastName: new FormControl("Kukadiya", Validators.required),
    status: new FormControl(true),
    access: new FormControl(true)
  });
  locations: any;

  apperance: string = "outline";

  constructor(private location: Location, private appointmentService: AppointmentService) { }

  ngOnInit() {
  }

  public onSelect(item) {
    console.log('tag selected: value is ' + item);
  }

  cancel() {
    this.location.back();
  }

  save() {
    console.log("form is ", this.businessForm);
    if (this.businessForm.valid) {
      console.log("form is valid");
      let Practitioner: Practitioner = {
        id: this.appointmentService.create_UUID(),
        name: this.businessForm.controls.firstName.value + " " + this.businessForm.controls.lastName.value,
        schedulerAccess: this.businessForm.controls.calenderAccess.value,
        speciality: this.businessForm.controls.speciality.value,
        type: 2
      }
      this.appointmentService.Practitioner = Practitioner;
      console.log(this.appointmentService.Practitioner);
      this.location.back();
      // this.appointmentService.Practitioner = ;
    }
  }
}
