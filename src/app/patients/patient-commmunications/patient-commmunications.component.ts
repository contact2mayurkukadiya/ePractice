import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-commmunications',
  templateUrl: './patient-commmunications.component.html',
  styleUrls: ['./patient-commmunications.component.css']
})
export class PatientCommmunicationsComponent implements OnInit {

  @Input() patientId: string;
  constructor() { }

  ngOnInit() {
    console.log(this.patientId);
  }

}
