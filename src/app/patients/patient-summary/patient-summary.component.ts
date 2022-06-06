import { Component, OnInit } from '@angular/core';
import { find } from 'rxjs/operators';

@Component({
  selector: 'app-patient-summary',
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.css'],
})
export class PatientSummaryComponent implements OnInit {
  patientSummary: any[] = [
    {
      active: true,
      number: '35',
      title: 'Total Bookings',
    },
    {
      active: false,
      number: '135',
      title: 'Upcoming Appointments',
    },
    {
      active: false,
      number: '2',
      title: 'No Shows',
    },
    {
      active: false,
      number: '5',
      title: 'Days since last visit',
    },
    {
      active: false,
      number: '$495',
      title: 'Claims Outstanding',
    },
    {
      active: false,
      number: '$94',
      title: 'Private Outstanding',
    },
    {
      active: false,
      number: '$0',
      title: 'Credit',
    },
    {
      active: false,
      number: '$94',
      title: 'Private Balance',
    },
  ];
  constructor() {}

  ngOnInit() {}

  onSummaryCLick(title) {
    this.patientSummary.map((p) => {
      p.active = false;
    });
    const findIndex = this.patientSummary.findIndex((x) => x.title === title);
    const pSummary = this.patientSummary.find((x) => x.title === title);
    pSummary.active = true;
    this.patientSummary[findIndex] = pSummary;
  }
}
