import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { State } from '@progress/kendo-data-query';
import { ApplicationDataService } from 'src/app/services/app.applicationdata.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BaseItemComponent } from '../../shared/base-item/base-item.component';
import { ApplicationDataModel } from 'src/app/models/app.misc';
import { MatButtonToggleChange } from '@angular/material';

@Component({
  selector: 'app-application-data',
  templateUrl: './application-data.component.html',
  styleUrls: ['./application-data.component.css'],
})
export class ApplicationDataComponent
  extends BaseItemComponent
  implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public gridData: any[] = [];
  public masterData: ApplicationDataModel[] = [];
  public masterAllData: ApplicationDataModel[] = [];
  public primaryData: any[] = [];
  public status: boolean;
  public title: string;
  public categoryId: number;
  public applicationId: number;
  applicationDataDescription = '<Title content here>';
  nodata: boolean;
  public actionsLayout = 'normal';

  public opened = true;
  public applicationData: ApplicationDataModel;

  constructor(
    public appState: AppState,
    public location: Location,
    public _route: ActivatedRoute,
    public applicationDataService: ApplicationDataService
  ) {
    super(location);
  }

  public ngOnInit() {
    this.opened = false;
    this.title = '';
    this.categoryId = 0;
    this.status = true;
    this.nodata = false;
    this.getApplicationdata();
  }

  getApplicationdata() {
    this.applicationDataService.getAllApplicationData().subscribe((data) => {
      this.masterAllData = data;
      if (data.length > 0) {
        const tempData = this.masterAllData.filter((x) => x.categoryId === 0);

        if (this.primaryData.length === 0) {
          tempData.map((x) => {
            const mData = {
              id: 0,
              categoryName: '',
              active: false,
            };

            mData.id = x.id;
            mData.categoryName = x.categoryName;
            this.primaryData.push(mData);
          });
        }
      }
    });
  }

  titleActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.masterData = this.masterAllData.filter(
        (x) => x.categoryId === this.categoryId && x.status === true
      );
    } else {
      this.masterData = this.masterAllData.filter(
        (x) => x.categoryId === this.categoryId && x.status === false
      );
    }
  }

  clickTitleTabs(tab: { categoryName: any; id: number }) {
    const ptabs = [];
    this.primaryData.forEach((x) => {
      if (x.categoryName === tab.categoryName) {
        x.active = true;
      } else {
        x.active = false;
      }
      ptabs.push(x);
    });

    this.primaryData = ptabs;
    console.log(tab);
    this.masterData = this.masterAllData.filter(
      (x) => x.categoryId === tab.id && x.status === true
    );
    if (this.masterData.length <= 0) {
      this.nodata = false;
    } else {
      this.nodata = true;
    }

    this.categoryId = tab.id;
    this.applicationDataDescription = this.masterAllData.find(
      (x) => x.id === tab.id
    ).categoryName;
  }

  openPopUp(id: number) {
    this.applicationId = id;
    const d = this.masterData.find((x) => x.id === id);
    if (d !== undefined) {
      this.title = d.categoryName;
    }
    this.opened = true;
  }

  public close() {
    this.opened = false;
  }

  public onDialogClose() {
    this.opened = false;
  }

  public onSaveData() {
    this.blockUI.start();
    this.submitting = true;

    if (this.applicationId === 0) {
      this.applicationData = new ApplicationDataModel(
        0,
        this.title,
        this.categoryId,
        this.status
      );

      this.applicationDataService
        .createApplicationData(this.applicationData)
        .subscribe(
          (d) => {
            this.submitting = false;
            this.displaySuccessMessage(
              'Your new Title is created successfully.'
            );
            this.title = '';
            this.applicationDataService
              .getApplicationDataByCategoryId(this.categoryId)
              .subscribe((data) => {
                this.masterData = data;

                if (this.masterData.length <= 0) {
                  this.nodata = false;
                } else {
                  this.nodata = true;
                }
              });
            this.blockUI.stop();
          },
          (error) => {
            this.displayErrorMessage(
              'Error occurred while adding Title, please try again.'
            );
            this.submitting = false;
            this.blockUI.stop();
            console.log(error);
          }
        );
    } else {
      this.applicationData = new ApplicationDataModel(
        this.applicationId,
        this.title,
        this.categoryId,
        this.status
      );
      this.applicationDataService
        .updateApplicationData(this.applicationData)
        .subscribe(
          (d) => {
            this.submitting = false;
            this.displaySuccessMessage('Your Title is created successfully.');
            this.title = '';
            this.applicationId = 0;
            this.applicationDataService
              .getApplicationDataByCategoryId(this.categoryId)
              .subscribe((data) => {
                this.masterData = data;

                if (this.masterData.length <= 0) {
                  this.nodata = false;
                } else {
                  this.nodata = true;
                }
              });
            this.blockUI.stop();
          },
          (error) => {
            this.displayErrorMessage(
              'Error occurred while adding Title, plea0se try again.'
            );
            this.submitting = false;
            this.blockUI.stop();
          }
        );
    }
    this.opened = false;
    this.getApplicationdata();
  }
}
