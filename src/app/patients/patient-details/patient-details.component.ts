import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { PatientService } from 'src/app/services/app.patient.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
})
export class PatientDetailsComponent
  extends BaseItemComponent
  implements OnInit {
  @Input() patientId: string;

  constructor(
    public location: Location,
    private patientService: PatientService
  ) {
    super(location);
  }

  ngOnInit() {
    // console.log(this.patientId);
    this.displayMessage();
  }

  displayMessage() {
    if (
      this.patientService.sharedData !== undefined &&
      this.patientService.sharedData !== ''
    ) {
      this.displaySuccessMessage(this.patientService.sharedData);
      this.patientService.sharedData = '';
    }

    setInterval(
      (a) => {
        this.displaySuccessMessage('');
      },
      5000,
      []
    );
  }
}
