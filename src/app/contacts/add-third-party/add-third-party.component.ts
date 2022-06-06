import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { ContactService } from '../../services/app.contact.service';
import { ApplicationDataService } from '../../services/app.applicationdata.service';
import { AppState } from '../../app.state';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import {
  ContactModel,
  ContactLocationModel,
} from '../../models/app.contact.model';
import { ApplicationDataEnum } from '../../enum/application-data-enum';
import { ApplicationDataModel } from '../../models/app.misc';
import { MiscService } from '../../services/app.misc.service';

@Component({
  selector: 'app-add-third-party-contacts',
  templateUrl: './add-third-party.component.html',
  styleUrls: ['./add-third-party.component.css'],
})
export class AddThirdPartyContactsComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  locationList: any[];
  titles: any[];
  titleData: any[];
  public filter: string;
  titleId: number;
  public expandCss: string;

  contactForm: FormGroup = new FormGroup({
    locationName: new FormControl('', Validators.required),
    organisationName: new FormControl('', Validators.required),
    departmentName: new FormControl(''),
    titleId: new FormControl(0),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    referenceNo: new FormControl(''),
    address: new FormControl(''),
    country: new FormControl('Australia'),
    state: new FormControl(''),
    city: new FormControl(''),
    postCode: new FormControl(''),
    workPhone: new FormControl(''),
    mobile: new FormControl(''),
    fax: new FormControl(''),
    emailId: new FormControl('', Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$'),),
    website: new FormControl('', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'),]),
    notes: new FormControl(''),
    isAllowAllLocation: new FormControl(false),
    status: new FormControl(true),
  });
  countries: any[]; 
  deleteButton: Boolean;

  constructor(
    private businessService: BusinessService,
    private appState: AppState,
    private _route: ActivatedRoute,
    private miscService: MiscService,
    public location: Location,
    public contactService: ContactService,
    public applicationDataService: ApplicationDataService
  ) {
    super(location);
    this.fillTitle();
  }

  ngOnInit() {
    this.businessService
      .getLocationsByBusiness(this.appState.userProfile.parentBusinessId)
      .subscribe((locations) => {
        this.locationList = locations;
      });

    this.miscService.getCountries().subscribe(countries => {
      this.countries = countries;
    });

    this.expandCss = 'col-xl-6';

    this.deleteButton = false;
    this._route.params.subscribe((params) => {
      if (params.contactId) {
        this.blockUI.start();
        this.addItem = false;
        this.deleteButton = true;
        this.itemid = params.contactId;
        this.contactService
          .getContactById(params.contactId)
          .subscribe((data: ContactModel) => {
            this.contactForm.patchValue(data);
            const locationName = [];
            data.contactLocation.forEach((pl) => {
              locationName.push(
                this.locationList.find((l) => l.id === pl.locationId)
              );
            });

            this.contactForm.get('locationName').patchValue(locationName);
          });
        this.blockUI.stop();
      }
    });
  }

  handleFilter(value) {
    if (this.titles !== undefined && this.titles.length > 0) {
      this.titleData = this.titles.filter(
        (s) => s.categoryName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
    this.filter = value;
  }

  handleCategoryChange(value) {
    this.titleId = value;
  }

  fillTitle() {
    this.applicationDataService
      .getApplicationDataByCategoryId(ApplicationDataEnum.title)
      .subscribe((data) => {
        this.titles = this.titleData = data;
      });
  }

  createThirdPartyContact() {
    const el = document.getElementById('heading');
    const contactModel: ContactModel = this.contactForm.value;
    const locations: ContactLocationModel[] = [];

    if (!this.contactForm.invalid) {
      this.blockUI.start();
      this.submitting = true;

      if (contactModel.locationName !== '') {
        contactModel.locationName.forEach((l) => {
          const model = new ContactLocationModel();
          model.locationId = l.id;
          model.contactId = this.itemid;
          locations.push(model);
        });
      }

      contactModel.contactLocation = locations;
      contactModel.contactType = 2;
      contactModel.postCode = String(contactModel.postCode === null ? '' : contactModel.postCode);
      contactModel.workPhone = String(contactModel.workPhone === null ? '' : contactModel.workPhone);
      contactModel.mobile = String(contactModel.mobile === null ? '' : contactModel.mobile);
      contactModel.fax = String(contactModel.fax === null ? '' : contactModel.fax);

      if (this.addItem) {
        this.contactService.createContact(contactModel).subscribe(
          () => {
            this.submitting = false;
            this.displaySuccessMessage('Contact added successfully.');            
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while adding Contact, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      } else {
        contactModel.id = this.itemid;
        this.contactService.updateContact(contactModel).subscribe(
          () => {
            this.submitting = false;
            this.displaySuccessMessage('Contact updated successfully.');
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while updating Contact, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      }
    }
  }

  public addNew(): void {
    this.applicationDataService
      .createApplicationData(
        new ApplicationDataModel(
          0,
          this.filter,
          ApplicationDataEnum.title,
          true
        )
      )
      .subscribe(
        (d) => {
          this.titleId = d;
          this.titles.push(
            new ApplicationDataModel(
              this.titleId,
              this.filter,
              ApplicationDataEnum.title,
              true
            )
          );
          this.handleFilter(this.filter);
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
        }
      );
  }
}
