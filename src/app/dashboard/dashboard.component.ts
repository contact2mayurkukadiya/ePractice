import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { AppState } from '../app.state';
import { BusinessService } from '../services/app.business.service';
import { DashboardService } from '../services/app.dashboard.service';
import { DashboardMapping, DashboardModel } from '../models/app.dashboard.model';
import { StaffService } from '../services/app.staff.service';
import { Subscription } from 'rxjs';
import { PatientService } from '../services/app.patient.service';
import { OfferingsService } from '../services/app.offerings.service';
import { ContactService } from '../services/app.contact.service';
import { AppointmentService } from '../services/app.appointment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  businessName: string;
  subscribe: Subscription;
  pageLoaded: boolean = false;

  dashboardMapping: DashboardMapping[] = [
    {
      title: "Set up Business",
      key: "isBusinessAdded",
      value: false
    },
    {
      title: "Add location",
      key: "isLocationAdded",
      value: false
    },
    {
      title: "Add staff (All staffs and practitioners)",
      key: "isStaffAdded",
      value: false
    },
    {
      title: "Set staff permission",
      key: "isStaffPermissionAdded",
      value: false
    },
    {
      title: "Set schedule for practitioner",
      key: "isPractitionerScheduled",
      value: false
    },
    {
      title: "Add Service",
      key: "isServiceAdded",
      value: false,
      skipOption: true
    },
    {
      title: "Add Class",
      key: "isClassAdded",
      value: false,
      skipOption: true
    },
    {
      title: "Add Product",
      key: "isProductAdded",
      value: false,
      skipOption: true
    },
    {
      title: "Add Contact",
      key: "isContactAdded",
      value: false,
      skipOption: true
    },
  ]

  public dashboard: DashboardModel = {
    id: "",
    isBusinessAdded: true,
    isClassAdded: true,
    isContactAdded: true,
    isLocationAdded: true,
    isPractitionerScheduled: true,
    isProductAdded: true,
    isServiceAdded: true,
    isStaffAdded: true,
    isStaffPermissionAdded: true
  };
  progressPercentage: number;

  constructor(public appService: AppService,
              private businssService: BusinessService,
              private dashboardService: DashboardService,
              private businessService: BusinessService,
              private staffService: StaffService,
              private patientService: PatientService,
              private offeringService: OfferingsService,              
              private contactService: ContactService,      
              private appointmentService: AppointmentService,        
              public appState: AppState) { 
    
  }

  ngOnInit() {
    this.subscribe = this.appState.userProfileSubject.subscribe(u => {
      if(u) {
        this.businssService.getParentBusiness(this.appState.UserProfile.parentBusinessId).subscribe(data => {
          this.businessName = data.businessName;
        });
      }
    });

    this.loadDashboardView();
  }

  private loadDashboardView() {
    this.dashboardService.getDashboardCheckListView().subscribe(data => {
      if(!data || data.id == "00000000-0000-0000-0000-000000000000") {
        let dashboardDefault:DashboardModel = {
          isBusinessAdded: false,
          isClassAdded: false,
          isContactAdded: false,
          isLocationAdded: false,
          isPractitionerScheduled: false,
          isProductAdded: false,
          isServiceAdded: false,
          isStaffPermissionAdded: false,
          isStaffAdded: false,
          id: "00000000-0000-0000-0000-000000000000"
        };
  
        this.dashboardService.createDashboardCheckList(dashboardDefault).subscribe(r => {
          this.dashboardService.getDashboardCheckListView().subscribe(d => {
            this.dashboard = d;
            this.checkStatus();
            this.pageLoaded = true;
          });
        });  
      }
      else {
        this.dashboard = data;
        this.checkStatus();
        this.pageLoaded = true;
      }
    });      
  }

  private checkStatus() {
      if(!this.dashboard.isLocationAdded) {
        this.checkIfLocationAdded();
      }

      if(!this.dashboard.isStaffAdded) {
        this.checkIfStaffAdded();
      }

      if(!this.dashboard.isServiceAdded) {
        this.checkIfServicesAdded();              
      }

      if(!this.dashboard.isPractitionerScheduled) {
        this.checkIfScheduleAdded();
      }

      if(!this.dashboard.isClassAdded) {
        this.checkIfClassAdded();
      }

      if(!this.dashboard.isProductAdded) {
        this.checkIfProductAdded();
      }

      if(!this.dashboard.isContactAdded) {
        this.checkIfContactAdded();
      }

      if(!this.dashboard.isReferralAdded) {
        this.checkIfReferralAdded(); 
      }

      this.calculatePercentage();
  }

  private checkIfLocationAdded() {
    this.businessService.getLocationsByBusiness(this.appState.userProfile.parentBusinessId).subscribe(data => {
      if(data && data.length > 0) {
        this.dashboard.isLocationAdded = true;
        this.updateDashboard();
      }
    });
  }

  private checkIfStaffAdded() {
    this.staffService.getStaffs().subscribe(staffs => {
      if(staffs && staffs.length > 0) {
        this.dashboard.isStaffAdded = true;
        this.updateDashboard();
      }
    });
  }

  private checkIfServicesAdded() {
    this.offeringService.getAllService().subscribe(s => {
      if(s && s.length > 0) {
        this.dashboard.isServiceAdded = true;
        this.updateDashboard();
      }
    });
  }

  private checkIfClassAdded() {
    this.offeringService.getAllClasses().subscribe(c => {
      if(c && c.length > 0) {
        this.dashboard.isClassAdded = true;
        this.updateDashboard();
      }
    });
  }

  private checkIfProductAdded() {
    this.offeringService.getAllProducts().subscribe(p => {
      if(p && p.length > 0) {
        this.dashboard.isProductAdded = true;
        this.updateDashboard();
      }
    });
  }

  private checkIfContactAdded() {
    this.contactService.getAllContact().subscribe(c => {
      if(c && c.length > 0) {
        this.dashboard.isContactAdded = true;
        this.updateDashboard();
      }
    });
  } 

  private checkIfScheduleAdded() {
    this.appointmentService.getAllPractitionerSchedulesDetails().subscribe(s => {
      if(s && s.length > 0) {
        this.dashboard.isPractitionerScheduled = true;
        this.updateDashboard();
      }
    });
  }

  private checkIfReferralAdded() {
    this.contactService.getAllContact().subscribe(s => {      
      if(s && s.length > 0) {
      }
    });
  }

  private checkIfThirdPartyAdded() {
    this.contactService.getAllContact().subscribe(s => {
      if(s && s.length > 0) {
        // this.dashboard.isThirdPartyAdded = true;
        // this.updateDashboard();
      }
    });
  }

  
  private updateDashboard() {
    this.dashboardService.updateDashboardCheckList(this.dashboard).subscribe(u => {
    });
    this.calculatePercentage();
  }

  private calculatePercentage() {
    let completed: number = 0;
      let total: number = 0;
      Object.keys(this.dashboard).forEach(key => {
        if(key != "id") {
          total = total + 1;
          if(this.dashboard[key] === true) {
            completed = completed + 1;
          }

          let mapping = this.dashboardMapping.find(d => d.key == key);
          if(mapping) {
            mapping.value = this.dashboard[key];
          }
        }
      });

      this.progressPercentage = (completed / total) * 100;
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  onSkipClick(event: MouseEvent, mapping: DashboardMapping) {
    event.preventDefault();
    this.dashboard[mapping.key] = true;
    mapping.value = true;
    this.updateDashboard();
    this.calculatePercentage();
  }

}
