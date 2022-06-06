import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-add-general-contacts',
  templateUrl: './add-general.component.html',
  styleUrls: ['./add-general.component.css'],
})
export class AddGeneralContactsComponent extends BaseItemComponent
  implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  locationList: any[];
  titles: any[];
  titleData: any[];
  contactCategory: any[];
  contactCategoryData: any[];
  public titleFilter: string;
  public contactFilter: string;
  titleId: number;
  categoryId: number;
  public expandCss: string;
  countries: any[];
  @Input() private contact: EventEmitter<string>;
  @Input() public generalType;
  deleteButton: Boolean;

  contactForm: FormGroup = new FormGroup({
    locationName: new FormControl('', Validators.required),
    organisationName: new FormControl('', Validators.required),
    departmentName: new FormControl(''),
    categoryId: new FormControl('', Validators.required),
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

  @Output("parentProductCallBack") parentProductCallBack: EventEmitter<any> = new EventEmitter();

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
    this.fillContactCategory();
  }

  ngOnInit() {
    this.businessService
      .getLocationsByBusiness(this.appState.userProfile.parentBusinessId)
      .subscribe((locations) => {
        this.locationList = locations;
      });

    this.contactForm.get('status').patchValue(true);

    this.miscService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
    this.expandCss = 'col-xl-6';

    if (this.contact !== undefined) {
      this.contact.subscribe((e) => {
        this.expandCss = e;
      });
    }

    if (this.generalType !== undefined) {
      this.contactForm.get('categoryId').patchValue(this.generalType);
    }

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
          });
        this.blockUI.stop();
      }
    });
  }

  handleTitlesFilter(value) {
    if (this.titles !== undefined && this.titles.length > 0) {
      this.titleData = this.titles.filter(
        (s) => s.categoryName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
    this.titleFilter = value;
  }

  handleTitlesCategoryChange(value) {
    this.titleId = value;
  }

  handleContactFilter(value) {
    if (this.contactCategory !== undefined && this.contactCategory.length > 0) {
      this.contactCategoryData = this.contactCategory.filter(
        (s) => s.categoryName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
    this.contactFilter = value;
  }

  handleContactCategoryChange(value) {
    this.categoryId = value;
  }

  fillTitle() {
    this.applicationDataService
      .getApplicationDataByCategoryId(ApplicationDataEnum.title)
      .subscribe((data) => {
        this.titles = this.titleData = data;
      });
  }

  fillContactCategory() {
    this.applicationDataService
      .getApplicationDataByCategoryId(ApplicationDataEnum.contactCategory)
      .subscribe((data) => {
        this.contactCategory = this.contactCategoryData = data;
      });
  }

  createGenaeralContact() {
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
      contactModel.contactType = 3;
      contactModel.categoryId = Number(contactModel.categoryId);
      contactModel.postCode = String(contactModel.postCode === null ? '' : contactModel.postCode);
      contactModel.workPhone = String(contactModel.workPhone === null ? '' : contactModel.workPhone);
      contactModel.mobile = String(contactModel.mobile === null ? '' : contactModel.mobile);
      contactModel.fax = String(contactModel.fax === null ? '' : contactModel.fax);

      if (this.addItem) {
        this.contactService.createContact(contactModel).subscribe(
          (e) => {
            this.submitting = false;
            this.parentProductCallBack.emit(e);
            this.cancelGenaeral();
            //this.displaySuccessMessage('Contact added successfully.');
            el.scrollIntoView();
            this.contactForm.reset();
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
          (e) => {
            this.submitting = false;
            this.parentProductCallBack.emit(e);
            this.cancel();
            this.contactForm.reset();
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

  cancelGenaeral() {
    if (document.getElementById("sliderShadow").style.display === "none") {
      this.cancel();
    } else {
      document.getElementById('slider').style.width = '0px';
      document.getElementById("sliderShadow").style.display = "none";
    }
  }

  public addNewTitle(): void {
    this.applicationDataService
      .createApplicationData(
        new ApplicationDataModel(
          0,
          this.titleFilter,
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
              this.titleFilter,
              ApplicationDataEnum.title,
              true
            )
          );
          this.handleTitlesFilter(this.titleFilter);
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
        }
      );
  }

  public addNewContact(): void {
    this.applicationDataService
      .createApplicationData(
        new ApplicationDataModel(
          0,
          this.contactFilter,
          ApplicationDataEnum.contactCategory,
          true
        )
      )
      .subscribe(
        (d) => {
          this.categoryId = d;
          this.contactCategory.push(
            new ApplicationDataModel(
              this.categoryId,
              this.contactFilter,
              ApplicationDataEnum.contactCategory,
              true
            )
          );
          this.handleContactFilter(this.contactFilter);
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
        }
      );
  }
}
