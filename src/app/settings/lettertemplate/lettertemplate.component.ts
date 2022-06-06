import { Component, OnInit } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';
import { SettingsService } from 'src/app/services/app.settings.service';
import { MatButtonToggleChange } from '@angular/material';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router, NavigationEnd } from '@angular/router';
import { MessageType } from 'src/app/models/app.misc';

@Component({
  selector: 'app-lettertemplate',
  templateUrl: './lettertemplate.component.html',
  styleUrls: ['./lettertemplate.component.css']
})
export class LettertemplateComponent extends BaseGridComponent implements OnInit {

  status: string = "active";
  letterTitle = '';
  letterRouteLink = '';
  letterRouteName = '';
  letterDescription = '';
  isLoading: boolean;
  listViewLetterShow = false;
  displaySuccessMessage: string;
  dataLoaded: boolean;
  isRoot = false;
  messageType = MessageType;
  @BlockUI() blockUI: NgBlockUI;
  constructor(private SettingService: SettingsService, private router: Router,) {
    super();
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/settings/lettertemplate';
    if (this.isRoot && !this.dataLoaded) {
      this.populateLanding();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = event.url === '/settings/lettertemplate';
        if (this.isRoot) {
          this.populateLanding();
        }
      }
    });
  }

  populateLanding() {
    this.removeFilterss();
    this.dataLoaded = true;
    this.SettingService.getAllBussinessTemplate(1).subscribe((data) => {
      console.log(data)
      if (data.length != 0) {
        this.letterTitle = 'You haven\'t added a Letter Template.';
        this.letterRouteLink = '/settings/lettertemplate/add';
        this.letterRouteName = 'Add Template';
        this.letterDescription =
          'You can create user-friendly Templates to save time while drafting Letters for patients.';
        this.listViewLetterShow = false;
      } else {
        this.listViewLetterShow = true;
        data.forEach(d => {
          if (d.description.length > 90) {
            d.description = d.description.substring(0, 70);
          }
          else {
            d.description = d.description
          }
        });
        this.gridData = data;
      }

      this.loadItemss();
    });
    this.isLoading = false;
    this.displayMessage();
  }
  LetterActiveChanged(event: MatButtonToggleChange) {
    // console.log(event); return;
    if (event.value == "active") {
      // console.log("inactive");
      this.setActiveFilters();
    }
    else {
      // console.log("active");
      this.setInactiveFilters();
    }
    this.loadItemss();
  }
  displayMessage() {
    console.log(this.SettingService.sharedData);
    if (
      this.SettingService.sharedData != undefined &&
      this.SettingService.sharedData != ''
    ) {
      this.displaySuccessMessage = this.SettingService.sharedData;
      setInterval(
        (a) => {
          this.displaySuccessMessage = '';
          this.SettingService.sharedData = '';
        },
        5000,
        []
      );
    }
  }
}
