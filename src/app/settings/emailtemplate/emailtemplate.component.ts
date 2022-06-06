import { Component, OnInit } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';
import { SettingsService } from 'src/app/services/app.settings.service';
import { MatButtonToggleChange } from '@angular/material';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, NavigationEnd } from '@angular/router';
import { MessageType } from 'src/app/models/app.misc';
import { BusinessTemplateModel } from 'src/app/models/app.settings.model';
@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.css']
})
export class EmailtemplateComponent extends BaseGridComponent implements OnInit {

  // status: string = "active";
  emailTitle = '';
  emailRouteLink = '';
  emailRouteName = '';
  emailDescription = '';
  isLoading: boolean;
  listViewEmailShow = false;
  displaySuccessMessage: string;
  dataLoaded: boolean;
  isRoot = false;
  showtoggle: boolean = false;
  messageType = MessageType;
  @BlockUI() blockUI: NgBlockUI;
  bussinesstemplate: BusinessTemplateModel[];
  constructor(private SettingService: SettingsService, private router: Router,) {
    super();
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/settings/emailtemplate';
    if (this.isRoot && !this.dataLoaded) {
      this.populateLanding();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = event.url === '/settings/emailtemplate';
        if (this.isRoot) {
          this.populateLanding();
        }
      }
    });
    this.displayMessage();
  }

  populateLanding() {
    this.removeFilterss();
    this.dataLoaded = true;
    this.SettingService.getAllBussinessTemplate(2).subscribe((data) => {
      if (data.length === 0) {
        this.emailTitle = 'You haven\'t added a Email Template.';
        this.emailRouteLink = '/settings/emailtemplate/add';
        this.emailRouteName = 'Add Template';
        this.emailDescription = 'You can create user-friendly Templates to save time while drafting emails for patients.';
        this.listViewEmailShow = false;
      } else {
        this.listViewEmailShow = true;
        data.forEach(d => {
          if (d.description.length > 90) {
            d.description = d.description.substring(0, 70);
          }
          else {
            d.description = d.description
          }
        });
      }
      this.gridData = data;
      this.loadItemss();
    });
    this.isLoading = false;
    this.displayMessage();
  }
  EmailActiveChanged(event: MatButtonToggleChange) {
    if (event.value == "active") {
      this.setActiveFilters();
    }
    else {
      this.setInactiveFilters();
    }
    this.loadItemss();
  }
  setActive() {
    this.setActiveFilters();
  }

  setInactive() {
    this.setInactiveFilters();
  }
  displayMessage() {
    console.log(this.SettingService.sharedData);
    if (
      this.SettingService.sharedData != undefined &&
      this.SettingService.sharedData != ''
    ) {
      this.displaySuccessMessage = this.SettingService.sharedData;
      // setInterval(
      //   (a) => {
      //     this.displaySuccessMessage = '';
      //     this.SettingService.sharedData = '';
      //   },
      //   10000,
      //   []
      // );
    }
  }
}
