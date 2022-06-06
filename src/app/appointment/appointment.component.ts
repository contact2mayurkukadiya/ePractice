import { Component, ViewChild } from '@angular/core';
import { AppointmentService, Practitioner } from './appointment.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { DxSchedulerComponent } from 'devextreme-angular';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})

export class AppointmentComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;
  sidebarExpand: boolean = true;
  showAddScheduleScreen: boolean = false;

  views: any = [{
    type: 'day',
    startDayHour: 9,
    endDayHour: 18,
    groups: ['speciality', 'name'],
  }, {
    type: 'workWeek',
    name: 'M-F',
    startDayHour: 9,
    endDayHour: 18,
    groups: ['speciality', 'name'],
    dateCellTemplate: 'dateCellTemplate'
  }, {
    type: 'week',
    startDayHour: 9,
    endDayHour: 18,
    groups: ['speciality', 'name'],
    dateCellTemplate: 'dateCellTemplate'
  }];
  currentView: 'day' | 'workWeek' | 'week' = 'day';
  // Orignal Object
  currentDate: Date = new Date();
  originalSpecialize: Array<any> = [];
  originalPractitionerList: Array<any> = [];

  specializeHeader: Array<any> = [];
  practitionerHeader: Array<any> = [];

  // Show in charts
  AllSpecialize: Array<any> = [];
  AllPractitionerList: Array<any> = [];
  appointmentsData: Array<any> = [];
  dayViewDataSource: Array<any> = [{ date: this.currentDate }];

  isSingleSelect: boolean = false;
  singleSelectedPractitioner: Practitioner;
  singleSelectedSpeciality: any;

  constructor(private appointmentService: AppointmentService, private dialog: MatDialog, private router: Router) {
    this.appointmentService.getPractioners.subscribe(result => {
      result.forEach(element => {
        element['selected'] = false;
      });
      this.originalPractitionerList = [...result];
      this.filterPractitioner(result).then(_result => {
        this.originalSpecialize = [..._result];
        this.initializeAllDataSource();
      })
    })
  }

  initializeAllDataSource() {
    this.AllPractitionerList = [];
    this.originalPractitionerList.forEach(item => {
      if (item.schedulerAccess == true) {
        this.AllPractitionerList.push(item);
      }
    })
    this.AllSpecialize = [...this.originalSpecialize];
  }

  showSinglePractitioner(practitioner) {
    console.log("practitioner", practitioner);
  }

  showSingleSpeciality(data) {
    console.log("speciality", data);
  }

  filterPractitioner(arr): Promise<any> {
    return new Promise(async resolve => {
      let specializeList = [];
      await arr.forEach(practitioner => {
        let specialityIndex = specializeList.findIndex(item => item.speciality == practitioner.speciality)
        if (specialityIndex != -1) {
          specializeList[specialityIndex].practitioners.push(practitioner);
        }
        else {
          specializeList.push({ speciality: practitioner.speciality, type: 1, practitioners: [practitioner], selected: false })
        }
      })
      resolve(specializeList);
    })
  }

  togglePanel() {
    this.sidebarExpand = !this.sidebarExpand;
  }

  checkForAnySingleSelect() {
    let selected = this.originalPractitionerList.find(item => item.selected == true)
    if (selected) {
      this.isSingleSelect = true;
      this.singleSelectedPractitioner = selected;
    }
    else {
      this.singleSelectedPractitioner = null
      this.isSingleSelect = false;
    }
  }

  giveSchedulerAccess(p) {
    this.originalPractitionerList.forEach(practitioner => {
      practitioner.id == p.id ? practitioner.schedulerAccess = true : null;
    })
    this.initializeAllDataSource();
  }

  selectPractitioner(practitioner) {
    for (let i = 0; i < this.originalPractitionerList.length; i++) {
      if (this.originalPractitionerList[i].id == practitioner.id) {
        this.originalPractitionerList[i].selected = !this.originalPractitionerList[i].selected
      }
      else {
        this.originalPractitionerList[i].selected = false
      }
    }
    this.checkForAnySingleSelect();
    this.filterPractitioner(this.originalPractitionerList).then(result => {
      this.originalSpecialize = result
    })
    if (this.isSingleSelect == true) {
      this.originalSpecialize.forEach(item => {
        console.log("item", item);
        let isItemFound = item.practitioners.find(item => item.id == this.singleSelectedPractitioner.id)
        if (isItemFound) {
          this.singleSelectedSpeciality = item;
        }
      })
      this.specializeHeader = [this.singleSelectedSpeciality]
      this.practitionerHeader = [this.singleSelectedPractitioner]
    }
    else {
      this.specializeHeader = this.AllSpecialize
      this.practitionerHeader = this.AllPractitionerList
    }
  }

  onAppointmentFormOpening(e) {
    console.log("data", e);
    e.cancel = true;
    if (e.appointmentData) {
      let schedulModalRef = this.dialog.open(CreateAppointmentComponent, {
        hasBackdrop: true,
        disableClose: true,
        position: { right: '0px', top: '0px', bottom: '0px' },
        data: { appointmentData: e.appointmentData, practitioners: this.practitionerHeader },
        panelClass: 'custom-slide-modal',
        width: '400px',
        maxWidth: '400px'
      });
      schedulModalRef.afterClosed().subscribe(data => {
        console.log("Final data", data);
        this.scheduler.instance.addAppointment(data);
      })
    }
  }

  onAppointmentAdding($event) {
    console.log("scheduler  adding", $event);
  }

  trackByFn(index) { return index }

  stopPropogation(event) {
    event.stopPropagation();
  }

  /* menuChanged(event: MenuModel) {
    switch(event.name) {
      case "Schedule":
        this.showSchedule = event.show;
        this.showAppointment = !this.showSchedule;
        this.showRoom = false;
        this.showWaitList = false;
        this.showPractitionerToday = false;
        break;
      case "Rooms":
        this.showRoom = event.show;
        this.showAppointment = !this.showRoom;
        this.showSchedule = false;
        this.showWaitList = false;        
        this.showPractitionerToday = false;
        break;
      case "Practitioner Today":
        this.showPractitionerToday = event.show;
        this.showAppointment = true;  
        this.showRoom = false;
        this.showWaitList = false;
        this.showPractitionerToday = false;
        break;
      case "Wait List":
        this.showWaitList = event.show;        
        this.showAppointment = true;
        this.showSchedule = false;
        this.showRoom = false;
        this.showPractitionerToday = false;
        break;
    }
  } */
}
