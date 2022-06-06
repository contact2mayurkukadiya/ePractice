import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppState } from '../app.state';
import { PatientModel } from '../models/app.patient.model';
import { PatientService } from '../services/app.patient.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatButtonToggleChange } from '@angular/material';
import { BaseGridComponent } from '../shared/base-grid/base-grid.component';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent extends BaseGridComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  apperance = 'outline';
  patients: PatientModel[];
  isRoot = false;
  isError = false;
  patientTitle = '';
  patientRouteLink = '';
  patientRouteName = '';
  patientDescription = '';
  isLoading: boolean;
  patientShow: boolean;
  dataLoaded: boolean;
  status: 'active';
  displaySuccessMessage: string;

  constructor(
    private router: Router,
    public appState: AppState,
    private patientService: PatientService
  ) {
    super();
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/patients';
    if (this.isRoot && !this.dataLoaded) {
      this.populateLanding();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = event.url === '/patients';
        if (this.isRoot) {
          this.populateLanding();
        }
      }
    });
  }

  populateLanding() {
    this.blockUI.start();
    this.dataLoaded = true;
    this.patientService.getAllPatients().subscribe((data) => {
      if (data.length === 0) {
        this.patientTitle = 'You haven\'t added a Patient';
        this.patientRouteLink = '/patients/add';
        this.patientRouteName = 'Add Patient';
        this.patientDescription =
          'Patient is recipient of allied health ervices from pratitoner in our Business Location';
        this.patientShow = false;
      } else {
        this.patientShow = true;
      }
      this.gridData = data;
      this.loadItems();
    });
    this.isLoading = false;
    this.blockUI.stop();
    this.displayMessage();
  }

  patientActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.setActiveFilter();
    } else {
      this.setInactiveFilter();
    }
    this.loadItems();
  }

  setActive() {
    this.setActiveFilter();
  }

  setInactive() {
    this.setInactiveFilter();
  }

  displayMessage() {
    if (
      this.patientService.sharedData !== undefined &&
      this.patientService.sharedData !== ''
    ) {
      this.displaySuccessMessage = this.patientService.sharedData;
      this.patientService.sharedData = '';
    }

    setInterval(
      (a) => {
        this.displaySuccessMessage = '';
      },
      5000,
      []
    );
  }
}
