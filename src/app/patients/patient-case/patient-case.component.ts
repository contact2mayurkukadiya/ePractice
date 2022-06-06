import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-case',
  templateUrl: './patient-case.component.html',
  styleUrls: ['./patient-case.component.css']
})
export class PatientCaseComponent implements OnInit {

  @Input() patientId: string;
  constructor() { }

  ngOnInit() {
    console.log(this.patientId);
  }

}
