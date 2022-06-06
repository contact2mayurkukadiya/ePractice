import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BusinessService } from '../services/app.business.service';
import { AppState } from '../app.state';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BusinessFormModel } from '../models/app.business.model';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { Tab } from '../models/app.tab.model';
import { SpecialtyComponent } from '../settings/specialty/specialty.component';
import { TreatmentRoomComponent } from '../settings/treatment-room/treatment-room.component';
import { TaxComponent } from '../settings/tax/tax.component';
import { ConcessionComponent } from '../settings/concession/concession.component';
import { PaymentTypeComponent } from '../settings/payment-type/payment-type.component';
import { DiscountTypeComponent } from '../settings/discount-type/discount-type.component';
import { MatTabChangeEvent, MatButtonToggle, MatButtonToggleChange } from '@angular/material';
import { MessageType } from '../models/app.misc';
import { MarketingReferralSourceComponent } from '../settings/marketing-referral-source/marketing-referral-source.component';
import { DocumentTypeComponent } from '../settings/document-type/document-type.component';
import { AppointmentTypeComponent } from '../settings/appointment-type/appointment-type.component';
import { CancelReasonComponent } from '../settings/cancel-reason/cancel-reason.component';
import { MissedReasonComponent } from '../settings/missed-reason/missed-reason.component';
import { BaseGridComponent } from '../shared/base-grid/base-grid.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LocationsComponent } from '../settings/locations/locations.component';
import { LocationRoleAndPermissionModel } from '../models/app.role.model';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})

export class ToolsComponent implements OnInit {
  @ViewChild(LocationsComponent, { static: false  }) locations: LocationsComponent;

  @BlockUI() blockUI: NgBlockUI;
  messageType = MessageType;
  
  business: BusinessFormModel;

  isRoot: boolean = false;
  isError: boolean = false;
  isLoading: boolean = true;

  isTablet: boolean;

  businessAccess: string[] = [];
  locationAccess: string[] = [];

  showBusinessInformationTab: boolean = false;
  showSpecialisationTab: boolean = false;
  showAppointmentSettingsTab: boolean = false;
  showPatientSettingsTab: boolean = false;
  showBillingTab: boolean = false;

  specialisationTabs: Tab[] = [
    {
      active: true,
      id: 1,
      component: SpecialtyComponent,
      title: "Specialty",
      addLabel: "Add Specialty",
      addUrl: "/tools/specialty/add"
    }
  ];

  appointmentTabs: Tab[] = [
    {
      active: true,
      id: 2,
      component: TreatmentRoomComponent,
      title: "Treatment Room",
      addLabel: "Add Treatment Room",
      addUrl: "/tools/treatmentRoom/add"
    },
    {
      active: true,
      id: 2,
      component: AppointmentTypeComponent,
      title: "Appointment Type",
      addLabel: "Add Appointment Type",
      addUrl: "/tools/appointmentType/add"
    },
    {
      active: true,
      id: 2,
      component: CancelReasonComponent,
      title: "Cancel Reason",
      addLabel: "Add Cancel Reason",
      addUrl: "/tools/cancelReason/add"
    },
    {
      active: true,
      id: 2,
      component: MissedReasonComponent,
      title: "Missed Reason",
      addLabel: "Add Missed Reason",
      addUrl: "/tools/missedReason/add"
    },
  ];

  patientTabs: Tab[] = [
    {
      active: true,
      id: 1,
      component: MarketingReferralSourceComponent,
      title: "Marketing Referral Source",
      addLabel: "Add Marketing Referral Source",
      addUrl: "/tools/marketingReferralSource/add"
    },
    {
      active: true,
      id: 1,
      component: ConcessionComponent,
      title: "Concession",
      addLabel: "Add Concession",
      addUrl: "/tools/concession/add"
    },
    {
      active: true,
      id: 1,
      component: DocumentTypeComponent,
      title: "Document Type",
      addLabel: "Add Document Type",
      addUrl: "/tools/documentType/add"
    },
  ]


  billingsTabs: Tab[] = [
    {
      active: true,
      id: 1,
      component: TaxComponent,
      title: "Tax",
      addLabel: "Add Tax",
      addUrl: "/tools/tax/add"
    },
    {
      active: true,
      id: 1,
      component: DiscountTypeComponent,
      title: "Discount Type",
      addLabel: "Add Discount Type",
      addUrl: "/tools/discountType/add"
    },
    {
      active: true,
      id: 1,
      component: PaymentTypeComponent,
      title: "Payment Type",
      addLabel: "Add Payment Type",
      addUrl: "/tools/paymentType/add"
    }  
  ];

  constructor(private router : Router,
              private businessService: BusinessService,
              public appState: AppState
    ) { 

  }

  ngOnInit() {
    this.isRoot = this.router.url == "/tools";
    if(this.isRoot) {
      this.populateLanding();      
    }
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.isRoot = event.url == "/tools";
        if(this.isRoot) {
          this.populateLanding();      
        }
      }
    });

    if(this.appState.applicableForPermission()) {
      this.appState.permissionState.subscribe(p => {
        let tools = p.find(p => p.moduleName == "Tools");
        this.showSpecialisationTab = this.tabAccess(tools, "Specialisation");
        this.showPatientSettingsTab = this.tabAccess(tools, "Patient Settings")
        this.showBusinessInformationTab = this.tabAccess(tools, "Business Information");
        this.showBillingTab = this.tabAccess(tools, "Billing");
        this.showAppointmentSettingsTab = this.tabAccess(tools, "Appointment Settings");
        if(tools) {
          let business = tools.appSubModules.find(m => m.subModuleName == "Business Information");
          let biPermission:string[] = [];
          if(tools.isFullAccess ) {
            biPermission = ["V", "E", "D"];
          }
          else {
            biPermission = business && business.accessLevel ? business.accessLevel.split(',') : [];
          }
          this.businessAccess = biPermission;
          this.locationAccess = biPermission;
        }
      });
    }
    else {
      this.showSpecialisationTab = true;
      this.showPatientSettingsTab = true;
      this.showBusinessInformationTab = true;
      this.showBillingTab = true;
      this.showAppointmentSettingsTab = true;
      this.businessAccess = ["V", "E", "D"];;
      this.locationAccess = ["V", "E", "D"];
    }
  }

  tabAccess(permission: LocationRoleAndPermissionModel, name: string) {
    return permission && (permission.isFullAccess || (permission.appSubModules && permission.appSubModules.find(a => a.subModuleName == name) != null));
  }


  populateLanding() {
    this.blockUI.start();
    this.businessService.getParentBusiness(this.appState.UserProfile.parentBusinessId).subscribe(data => {
      if(data.businessLogo) {
        data.businessLogo = `data:image/jpg;base64,${data.businessLogo}`;
      }
      
      this.business = data;

      if(data.startTime && data.endTime) {
        let start = new Date(data.startTime);
        let end = new Date(data.endTime);
        let startString = start.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
        let endString = end.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
        this.business.timeString = `${startString} to ${endString}`;  
      }

      this.blockUI.stop();
    }, error => {
      console.log(error);
      this.blockUI.stop();
      this.isError = true;
    });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedTabState.next(tabChangeEvent.index);
  }

  specialisationTabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedSpecialisationTabState.next(tabChangeEvent.index);
  }

  appointmentTabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedAppointmentTabState.next(tabChangeEvent.index);
  }

  patientTabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedPatientTabState.next(tabChangeEvent.index);
  }

  billingTabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedBillingTabState.next(tabChangeEvent.index);
  }

  locationActiveChanged(event: MatButtonToggleChange) {
    if(event.value == "active") {
      this.locations.setActiveFilter();
    }
    else {
      this.locations.setInactiveFilter();
    }
    this.locations.loadItems();
  }

  specialisationActiveChanged(event: MatButtonToggleChange) {
    let tab = this.specialisationTabs.find(t => t.title == event.source.name);
    tab.active = event.value == "active";
  }

  appointmentActiveChanged(event: MatButtonToggleChange) {
    let tab = this.appointmentTabs.find(t => t.title == event.source.name);
    tab.active = event.value == "active";
  }

  patientActiveChanged(event: MatButtonToggleChange) {
    let tab = this.patientTabs.find(t => t.title == event.source.name);
    tab.active = event.value == "active";
  }

  billingActiveChanged(event: MatButtonToggleChange) {
    let tab = this.billingsTabs.find(t => t.title == event.source.name);
    tab.active = event.value == "active";
  }
}
