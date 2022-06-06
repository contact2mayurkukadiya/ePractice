import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-letters',
  templateUrl: './patient-letters.component.html',
  styleUrls: ['./patient-letters.component.css']
})
export class PatientLettersComponent implements OnInit {

  @Input() patientId: string;
  constructor() { }

  ngOnInit() {
    console.log(this.patientId);
  }

}
