import { Component, OnInit, Input } from '@angular/core';
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
  ContactSpecialtyModel,
} from '../../models/app.contact.model';
import { ApplicationDataEnum } from '../../enum/application-data-enum';
import { ApplicationDataModel } from '../../models/app.misc';
import { MiscService } from '../../services/app.misc.service';
import { SettingsService } from '../../services/app.settings.service';
import { GroupResult, groupBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-add-referral-contacts',
  templateUrl: './add-referral.component.html',
  styleUrls: ['./add-referral.component.css'],
})
export class AddReferralContactsComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  locationList: any[];
  titles: any[];
  titleData: any[];
  public filter: string;
  titleId: number;
  public expandCss: string;
  countries: any[];
  specialties: any[];
  deleteButton: boolean;
  contactForm: FormGroup = new FormGroup({
    locationName: new FormControl('', Validators.required),
    specialtyName: new FormControl('', Validators.required),
    organisationName: new FormControl('', Validators.required),
    titleId: new FormControl(0),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    providerNo: new FormControl(''),
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

  public specialtyData: any[] = [];
  public groupedSpecialtyData: GroupResult[];
  specialtyAllList: any[];
  specialtyEnable = true;
  specialtyDataTemp: any[] = [];

  constructor(
    private businessService: BusinessService,
    private appState: AppState,
    private _route: ActivatedRoute,
    public location: Location,
    public contactService: ContactService,
    private settingsService: SettingsService,
    private miscService: MiscService,
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

    this.settingsService.getAllSpecialties().subscribe((specialtyData) => {
      this.specialtyAllList = specialtyData;
    });

    this.expandCss = 'col-xl-6';

    this.deleteButton = false;
    this._route.params.subscribe((params) => {
      if (params.contactId) {
        this.blockUI.start();
        this.addItem = false;
        this.itemid = params.contactId;
        this.deleteButton = true;
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
            this.populateSpecialty(locationName);
            this.specialtyEnable = false;

            const specialtyName = [];
            this.specialtyDataTemp = [];
            data.contactSpecialty.forEach((s) => {
              const location = this.locationList.filter(
                (x) => x.id === s.locationId
              );
              const specialty = this.specialtyAllList.filter(
                (x) => x.id === s.specialtyId
              );

              const sData = {
                id: '',
                idAndLocationId: '',
                specialtyName: '',
                locationId: '',
                locationName: '',
              };
              sData.id = s.specialtyId;
              sData.idAndLocationId = s.specialtyId + location[0].id;
              sData.specialtyName =
                specialty[0].specialtyName +
                ' (' +
                location[0].locationName +
                ')';
              sData.locationId = location[0].id;
              sData.locationName = location[0].locationName;

              this.specialtyDataTemp.push(sData);

              specialtyName.push(
                this.specialtyAllList.find((sl) => sl.id === s.specialtyId)
              );
            });

            this.contactForm
              .get('specialtyName')
              .patchValue(this.specialtyDataTemp);
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

  createReferralContact() {
    const el = document.getElementById('heading');
    const contactModel: ContactModel = this.contactForm.value;
    const locations: ContactLocationModel[] = [];
    const specialty: ContactSpecialtyModel[] = [];

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

      if (contactModel.specialtyName !== '') {
        contactModel.specialtyName.forEach((s) => {
          const model = new ContactSpecialtyModel();
          model.specialtyId = s.id;
          model.locationId = s.locationId;
          model.contactId = this.itemid;
          specialty.push(model);
        });
      }

      contactModel.contactLocation = locations;
      contactModel.contactSpecialty = specialty;
      contactModel.contactType = 1;
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
            this.displayErrorMessage('Error occurred while adding Contact, please try again.');
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
            this.displayErrorMessage('Error occurred while updating Contact, please try again.');
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      }
    }
  }

  onLocationChange(locationData) {
    if (locationData.length === 0) {
      this.groupedSpecialtyData = groupBy([], [{ field: 'locationName' }]);
      this.specialtyData = [];
      this.contactForm.get('specialtyName').patchValue('');
    } else {
      this.removeSpecialty(locationData);
      this.populateSpecialty(locationData);
    }
  }

  removeSpecialty(locationData) {
    this.specialtyDataTemp = [];
    const specialtyNameData = this.contactForm.get('specialtyName').value;
    if (specialtyNameData !== null && specialtyNameData.length > 0) {
      locationData.forEach((e) => {
        const specialty = specialtyNameData.filter(
          (x) => x.locationName === e.locationName
        );

        specialty.forEach((element) => {
          const sData = {
            id: element.id,
            idAndLocationId: element.idAndLocationId,
            specialtyName: element.specialtyName,
            locationId: element.locationId,
            locationName: element.locationName,
          };

          this.specialtyDataTemp.push(sData);
        });
      });
      this.contactForm.get('specialtyName').patchValue(this.specialtyDataTemp);
    }
  }


  populateSpecialty(locationData) {
    this.specialtyData = [];
    locationData.forEach((e) => {
      this.specialtyEnable = false;
      this.specialtyAllList.forEach((s) => {
        const sLocation = s.specialtyLocation.filter(
          (x) => x.locationId === e.id
        );
        if (sLocation.length > 0) {
          const specialtyDataCheck = this.specialtyData.filter(
            (x) => x.locationId === e.id && x.id === s.id
          );

          const sData = {
            id: '',
            idAndLocationId: '',
            specialtyName: '',
            locationId: '',
            locationName: '',
          };
          sData.id = s.id;
          sData.idAndLocationId = s.id + sLocation[0].locationId;
          sData.specialtyName =
            s.specialtyName + ' (' + sLocation[0].locationName + ')';
          sData.locationId = sLocation[0].locationId;
          sData.locationName = sLocation[0].locationName;
          if (specialtyDataCheck.length === 0) {
            this.specialtyData.push(sData);
            this.groupedSpecialtyData = groupBy(this.specialtyData, [
              { field: 'locationName' },
            ]);
          }
        }
      });
    });

    if (this.specialtyData.length > 0) {
      this.specialtyEnable = false;
    } else {
      this.specialtyEnable = true;
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
