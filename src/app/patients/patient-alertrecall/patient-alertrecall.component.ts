import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-alertrecall',
  templateUrl: './patient-alertrecall.component.html',
  styleUrls: ['./patient-alertrecall.component.css']
})
export class PatientAlertrecallComponent implements OnInit {
  @Input() patientId: string;
  constructor() { }

  ngOnInit() {
    console.log(this.patientId);
  }

}
