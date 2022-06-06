import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from '../animations/animations';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { BusinessService } from '../services/app.business.service';
import { AppState } from '../app.state';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SortDescriptor } from '@progress/kendo-data-query';
import { MenuModel } from '../models/app.menu.model';
import { BaseItemComponent } from '../shared/base-item/base-item.component';
import { PatientService } from '../services/app.patient.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [onSideNavChange, animateText]
})
export class SettingsComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  isRoot: boolean = false;
  isError: boolean = false;
  isLoading: boolean = true;

  public multiple = false;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'id',
    dir: 'asc'
  }];


  public menus: MenuModel[] = [
    {
      name: 'Personalisation', link: '', icon: '', hover: '', child: [
        { name: 'Patient ID', link: '/settings/personalize/patient', icon: '', hover: 'Patient ID' },
        { name: 'Invoice ID', link: '/settings/personalize/invoice', icon: '', hover: 'Invoice ID' },
        { name: 'Payment ID', link: '/settings/personalize/payment', icon: '', hover: 'Payment ID' }
      ]
    },
    {
      name: 'Communications', link: '', icon: '', hover: '', child: [
        { name: 'SMS Account set up', link: '', icon: '', hover: 'SMS Account set up' },
        { name: 'SMS History', link: '', icon: '', hover: 'SMS History' },
        { name: 'SMS Settings', link: '', icon: '', hover: 'SMS Settings' }
      ]
    },
    {
      name: 'Templates', link: '', icon: '', hover: '', child: [
        { name: 'SMS Templates', link: '', icon: 'add', hover: 'SMS' },
        { name: 'Email Templates', link: '/settings/emailtemplate/', icon: '', hover: 'Email' },
        { name: 'Letter Templates', link: '/settings/lettertemplate/', icon: '', hover: 'Letters' },
        { name: 'Treatment Notes Template', link: '/settings/treatmentnotestemplate', icon: '', hover: 'Treatment Notes Template' },
        { name: 'Invoice Template', link: '', icon: '', hover: 'Invoice Template' },
        { name: 'Intake Forms Template', link: '', icon: '', hover: 'Intake Forms Template' }
      ]
    },
    {
      name: 'Reminder Settings', link: '', icon: '', hover: '', child: [
        { name: 'Appointment Reminders', link: '', icon: '', hover: 'Appointment Reminders' },
        { name: 'Event Reminders', link: '', icon: '', hover: 'Event Reminders' }
      ]
    },
    {
      name: 'Data ', link: '', icon: '', hover: '', child: [
        { name: 'Application Data', link: '/settings/applicationdata/', icon: '', hover: 'Application Data' },
        { name: 'Import', link: '', icon: '', hover: 'Import' },
        { name: 'Export', link: '', icon: '', hover: 'Export' },
        { name: 'Data Storage', link: '', icon: '', hover: 'Data Storage' },
      ]
    },
    {
      name: 'Integrations  ', link: '', icon: '', hover: '', child: [
        { name: 'Online Booking', link: '', icon: '', hover: 'Online Booking' },
        { name: 'Medicare', link: '', icon: '', hover: 'Medicare' },
        { name: 'DVA', link: '', icon: '', hover: 'DVA' },
        { name: 'Xero', link: '', icon: '', hover: 'Xero' },
      ]
    }
  ]

  constructor(private router: Router,
    public location: Location,
    private businessService: BusinessService,
    private patientService: PatientService,
    private appState: AppState
  ) {
    super(location);
  }

  ngOnInit() {
    this.isRoot = this.router.url == "/settings";
    if (this.isRoot) {
      this.populateLanding();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = event.url == "/settings";
        if (this.isRoot) {
          this.populateLanding();
        }
      }
    });

  }

  populateLanding() {
    this.displayMessage();
  }

  displayMessage() {
    if (this.patientService.sharedData !== undefined && this.patientService.sharedData !== '') {
      this.displaySuccessMessage(this.patientService.sharedData);
      this.patientService.sharedData = '';
    }

    setInterval(a => {
      this.displaySuccessMessage('');
    }, 5000, []);
  }
}
