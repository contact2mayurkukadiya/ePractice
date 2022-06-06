import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-contact',
  templateUrl: './patient-contact.component.html',
  styleUrls: ['./patient-contact.component.css']
})
export class PatientContactComponent implements OnInit {

  @Input() patientId: string;
  constructor() { }

  ngOnInit() {
    console.log(this.patientId);
  }

}
