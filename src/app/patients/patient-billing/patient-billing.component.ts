import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';

@Component({
  selector: 'app-patient-billing',
  templateUrl: './patient-billing.component.html',
  styleUrls: ['./patient-billing.component.css'],
})
export class PatientBillingComponent
  extends BaseGridComponent
  implements OnInit {
  @Input() patientId: string;
  constructor() {
    super();
  }

  ngOnInit() {
    console.log(this.patientId);
  }
}
