import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  apperance = 'outline';
  addPatient = true;
  @Input() patientId: string;

  constructor(public location: Location) {
    super(location);
  }

  ngOnInit() {}
}
