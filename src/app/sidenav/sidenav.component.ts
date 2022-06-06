import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/app.authenication.service';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { onSideNavChange, animateText } from '../animations/animations';
import { AppState } from '../app.state';
import { LocationGridModel } from '../models/app.location.model';
import { BusinessService } from '../services/app.business.service';
import { RoleService } from '../services/app.role.service';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [onSideNavChange, animateText]
})
export class SidenavComponent implements OnInit {
  private sideNavState: boolean;
  
  constructor(public appState: AppState,
    ) { 
  }

  ngOnInit() {
    this.sideNavState = this.appState.sideNavToggle;
  }

  onLocationChanged(change: MatSelectChange) {
    this.appState.selectedUserLocationIdState.next(change.value);
  }

  onSidenavToggle() {
    this.sideNavState = !this.appState.sideNavToggle;
    this.appState.sideNavState.next(this.sideNavState);
  }
}
