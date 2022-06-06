import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { MenuModel } from 'src/app/models/app.menu.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-header',
  templateUrl: './appointment-header.component.html',
  styleUrls: ['./appointment-header.component.css']
})
export class AppointmentHeaderComponent implements OnInit {
  @Output() onActiveChanged: EventEmitter<MenuModel> = new EventEmitter<MenuModel>();
  @Output() onCreateClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public appState: AppState,
    private router: Router,) { }



  // {name: 'Create Appt', link:'/appointment', icon: '', hover: '', show: false, enabled: true },

  appointmentLinks: MenuModel[] = [    
    {name: 'Practitioner Today', link:'/appointment/today', icon: '', hover: '', show: false, enabled: true },
    {name: 'Schedule', link:'/appointment/schedule', icon: '', hover: '', show: false, enabled: true },
    {name: 'Wait List', link:'/appointment/waitlist', icon: '', hover: '', show: false, enabled: true },
    {name: 'Rooms', link:'/appointment/room', icon: '', hover: '', show: false, enabled: true },
  ]

  ngOnInit() {
  }

  onCreateAppointmentClick(event: MouseEvent) {
    event.preventDefault();    
    this.onCreateClicked.emit(true);
  }

  onMenuClick(event: MouseEvent, menu: MenuModel) {  
    if(event) {
      event.preventDefault();
    }    
    menu.show = !menu.show;

    if(menu.name == "Schedule") {
      // let r = this.appointmentLinks.find(a => a.name == "Rooms");
      // r.show = false;
      // let wl = this.appointmentLinks.find(a => a.name == "Wait List");
      // wl.show = false;
      // this.hideAllMenuExcept("Schedule");
      this.hideMenu("Rooms");
      this.hideMenu("Wait List");
    }

    if(menu.name == "Rooms") {
      this.hideAllMenuExcept(menu.name);
    }

    if(menu.name == "Wait List") {
      this.hideAllMenuExcept(menu.name);
    }
    
    this.onActiveChanged.emit(menu);
  }

  hideMenu(name: string) {
    let m = this.appointmentLinks.find(a => a.name == name);
    m.show = false;
  }

  showMenu(name: string) {
    let m = this.appointmentLinks.find(a => a.name == name);
    m.show = true;
  }

  hideAllMenuExcept(name: string) {
    this.appointmentLinks.filter(a => a.name != name).forEach(a => {
      a.show = false;
    });
  }

  onlyEnableFor(name: string) {
    this.appointmentLinks.forEach(a => a.enabled = false);
    let a = this.appointmentLinks.find(a => a.name == name);
    a.enabled = true;
  }

}
