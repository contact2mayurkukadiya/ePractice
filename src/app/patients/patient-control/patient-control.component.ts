import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { ApplicationDataModel } from 'src/app/models/app.misc';
import { MiscService } from 'src/app/services/app.misc.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dt-format';
import { ApplicationDataService } from 'src/app/services/app.applicationdata.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApplicationDataEnum } from 'src/app/enum/application-data-enum';
import { StaffService } from 'src/app/services/app.staff.service';
import { ContactService } from 'src/app/services/app.contact.service';
import { SettingsService } from '../../services/app.settings.service';
import {
  PatientModel,
  PatientLocationModel,
  PatientHealthFundModel,
  PatientCommunicationModel,
} from '../../models/app.patient.model';
import { MarketingSourceModel } from 'src/app/models/app.settings.model';
import { PatientService } from 'src/app/services/app.patient.service';
import { ImageSnippet } from '../../models/app.misc';
import {
  cardCheck,
  dvaCardCheck,
  medicareCardCheck,
} from 'src/app/helpers/card-check.helper';

@Component({
  selector: 'app-patient-control',
  templateUrl: './patient-control.component.html',
  styleUrls: ['./patient-control.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class PatientControlComponent
  extends BaseItemComponent
  implements OnInit {
  @ViewChild(ImageUploadComponent, { static: true })
  image: ImageUploadComponent;
  @BlockUI() blockUI: NgBlockUI;
  apperance = 'outline';
  addPatient = true;
  public contact: EventEmitter<string> = new EventEmitter();
  @Input() patientId: string;
  @Output() appId: EventEmitter<number> = new EventEmitter<number>();

  patientForm: FormGroup = new FormGroup({
    patientPhoto: new FormControl(''),
    patientStatus: new FormControl(''),
    position: new FormControl(''),
    mobile: new FormControl('', Validators.pattern('^[0-9]*$')),
    email: new FormControl('', [
      Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$'),
    ]),
    locationName: new FormControl(''),
    practitionerId: new FormControl(''),
    patientClassification: new FormControl(''),
    gender: new FormControl(''),
    nationality: new FormControl(''),
    language: new FormControl(''),
    isStatus: new FormControl(true),
    address: new FormControl(''),
    country: new FormControl('Australia'),
    state: new FormControl(''),
    city: new FormControl(''),
    postCode: new FormControl('', Validators.pattern('^[0-9]*$')),
    homePhone: new FormControl('', Validators.pattern('^[0-9]*$')),
    workPhone: new FormControl('', Validators.pattern('^[0-9]*$')),
    title: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    middleName: new FormControl(''),
    preferredName: new FormControl(''),
    dob: new FormControl(null),
    dobDisable: new FormControl(''),
    relationship: new FormControl(''),
    emergencyContactName: new FormControl(''),
    emergencyContactHomePhone: new FormControl(
      '',
      Validators.pattern('^[0-9]*$')
    ),
    emergencyContactWorkPhone: new FormControl(
      '',
      Validators.pattern('^[0-9]*$')
    ),
    emergencyContactMobile: new FormControl('', Validators.pattern('^[0-9]*$')),
    emergencyContactEmail: new FormControl('', [
      Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$'),
    ]),
    medicalCondition: new FormControl(''),
    allergy: new FormControl(''),
    medication: new FormControl(''),
    occupation: new FormControl(''),
    designation: new FormControl(''),
    employer: new FormControl(''),
    employerDepartmentName: new FormControl(''),
    employerContactPerson: new FormControl(''),
    employerWorkPhone: new FormControl('', Validators.pattern('^[0-9]*$')),
    employerEmail: new FormControl(''),
    marketingSource: new FormControl(''),
    communicationConsentSMSReminder: new FormControl(false),
    communicationConsentSMSMarketing: new FormControl(false),
    communicationConsentEmailReminder: new FormControl(false),
    communicationConsentEmailMarketing: new FormControl(false),
    concession: new FormControl(''),
    invoiceNotes: new FormControl(''),
    creditCardType: new FormControl(''),
    cardHolderName: new FormControl(''),
    creditCardNumber: new FormControl(''),
    expiryMonth: new FormControl(''),
    expiryYear: new FormControl('', Validators.pattern('^[0-9]*$')),
    cvv: new FormControl('', Validators.pattern('^[0-9]*$')),
    accountName: new FormControl(''),
    bsbCode: new FormControl(''),
    accountNumber: new FormControl(''),
    healthFundId: new FormControl(''),
    membershipNumber: new FormControl(''),
    irnUpi: new FormControl(''),
    healthFundCardType: new FormControl(''),
    healthFundExpiryMonth: new FormControl(''),
    healthFundExpiryYear: new FormControl(''),
    claimantFirstName: new FormControl(''),
    claimantLastName: new FormControl(''),
    claimantMedicareNo: new FormControl(''),
    claimantIrnUpi: new FormControl(''),
    claimantDOB: new FormControl(null),
  });

  months: Array<any> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  irnUpis: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  patientTabs: Array<any> = [
    {
      active: true,
      title: 'Personal Details',
      validate: 0,
    },
    {
      active: false,
      title: 'Contact Details',
      validate: 0,
    },
    {
      active: false,
      title: 'Medical Details',
      validate: 0,
    },
    {
      active: false,
      title: 'Employer Details',
      validate: 0,
    },
    {
      active: false,
      title: 'Marketing Details',
      validate: 0,
    },
    {
      active: false,
      title: 'Billing Details',
      validate: 0,
    },
    {
      active: false,
      title: 'Health Fund Details',
      validate: 0,
    },
  ];

  personalDetails = true;
  contactDetails = false;
  medicalDetails = false;
  employerDetails = false;
  marketingDetails = false;
  billingDetails = false;
  healthFundDetails = false;
  countries: any[];
  appData: ApplicationDataModel[];
  titleData: ApplicationDataModel[];
  patientStatusData: ApplicationDataModel[];
  patientPositionData: ApplicationDataModel[];
  patientClassificationData: ApplicationDataModel[];
  patientRelationshipData: ApplicationDataModel[];
  patientOccupationData: ApplicationDataModel[];
  cardTypeData: ApplicationDataModel[];
  healthFundNameData: ApplicationDataModel[];
  patientMedicareHealthFund: PatientHealthFundModel;
  patientDVAHealthFund: PatientHealthFundModel;
  patientHealthFund: PatientHealthFundModel[] = [];
  titleFilter: any;
  patientStatusFilter: any;
  patientPositionFilter: any;
  patientClassificationFilter: any;
  patientRelationshipFilter: any;
  patientOccupationFilter: any;
  healthFundNameFilter: any;
  cardTypeFilter: any;
  employers: any[];
  addNewFundFlag: boolean;
  medicareFlag: boolean;
  dvaFlag: boolean;
  otherFlag: boolean;
  expandCss: string;
  addClaimantFlag: boolean;
  activeTab: string;
  locationList: any[];
  concessions: any;
  marketingSources: MarketingSourceModel[];
  marketingSourcesData: any[] = [];
  concessionsData: any[] = [];
  concessionsDataDefault: any[] = [];
  marketingSourcesDataDefault: any[] = [];
  isFundAvaiable = false;
  practitionerDefault: any[] = [];
  public practitionerData: any[] = [];
  practitionerList: any[] = [];
  addressData: any;
  firstVisitDate: string;
  pId: string;
  deleteButton: boolean;
  titleId: number;
  titleParentId: number;
  patientStatusId: number;
  patientStatusParentId: number;
  patientClassificationId: number;
  patientClassificationParentId: number;
  patientPositionId: number;
  patientPositionParentId: number;
  patientRelationshipId: number;
  patientRelationshipParentId: number;
  patientOccupationId: number;
  patientOccupationParentId: number;
  cardTypeId: number;
  cardTypeParentId: number;
  healthFundNameId: number;
  healthFundNameParentId: number;

  constructor(
    public businessService: BusinessService,
    public appState: AppState,
    public location: Location,
    private miscService: MiscService,
    private settingsService: SettingsService,
    public _route: ActivatedRoute,
    private router: Router,
    public contactService: ContactService,
    private staffService: StaffService,
    private patientService: PatientService,
    public applicationDataService: ApplicationDataService
  ) {
    super(location);
    this.getAppData();
    this.fillEmployer();
    this.expandCss = 'col-xl-6';
    this.addClaimantFlag = false;
    this.firstVisitDate = '';
    this.pId = '';
    this.deleteButton = false;
    this.titleParentId = ApplicationDataEnum.title;
    this.patientStatusParentId = ApplicationDataEnum.patientStatus;
    this.patientClassificationParentId =
      ApplicationDataEnum.patientClassification;
    this.patientPositionParentId = ApplicationDataEnum.patientPosition;
    this.patientRelationshipParentId = ApplicationDataEnum.patientRelationship;
    this.patientOccupationParentId = ApplicationDataEnum.patientOccupation;
    this.cardTypeParentId = ApplicationDataEnum.cardType;
    this.healthFundNameParentId = ApplicationDataEnum.healthFundName;
  }

  ngOnInit() {
    this.appState.selectedUserLocationIdState.subscribe((locationId) => {
      console.log(locationId); 
    });

    this.populateData();
    if (this.patientId !== undefined) {
      this.patientService
        .getPatientById(this.patientId)
        .subscribe((data: PatientModel) => {
          this.addItem = false;
          this.patientForm.patchValue(data);
          if (data.patientPhoto) {
            this.image.selectedFile = new ImageSnippet(
              `data:image/jpeg;base64,${data.patientPhoto}`,
              null
            );
          }

          const locationName = [];
          data.patientLocation.forEach((pl) => {
            const loc = this.locationList.find((l) => l.id === pl.locationId);
            if (loc !== undefined) {
              locationName.push(loc);
            }
          });
          this.patientForm.get('locationName').patchValue(locationName);
          if (this.patientForm.get('dob').value !== '') {
            this.dateOfBirthchange(this.patientForm.get('dob').value);
          }
          data.patientHealthFund.forEach((phf) => {
            if (phf.healthFundId === ApplicationDataEnum.Medicare) {
              this.patientMedicareHealthFund = phf;
            } else if (phf.healthFundId === ApplicationDataEnum.DVA) {
              this.patientDVAHealthFund = phf;
            } else {
              this.patientHealthFund.push(phf);
            }
          });
          this.firstVisitDate = data.firstVisitDate;
          this.pId = data.patientId;
          this.titleId = data.title;
          this.patientStatusId = data.patientStatus;
          this.patientClassificationId = data.patientClassification;
          this.patientPositionId = data.position;
          this.patientRelationshipId = data.relationship;
          this.patientOccupationId = data.occupation;
          this.cardTypeId = data.creditCardType;

          if (data.creditCardNumber !== '') {
            const maskedSection = data.creditCardNumber.slice(0, -4);
            const visibleSection = data.creditCardNumber.slice(-4);
            const creditcardMasked =
              maskedSection.replace(/./g, '*') + visibleSection;
            this.patientForm
              .get('creditCardNumber')
              .patchValue(creditcardMasked);
          }

          this.deleteButton = true;
          if (data.patientHealthFund.length > 0) {
            this.isFundAvaiable = true;
          }

          this.patientTabs.forEach((x) => {
            x.validate = this.validateData(x.title);
          });

          this.handleEmployerChange(data.employer);

          data.patientCommunication.forEach((c) => {
            if (c.communicationType === 'Email') {
              this.patientForm
                .get('communicationConsentEmailReminder')
                .patchValue(c.reminder);
              this.patientForm
                .get('communicationConsentEmailMarketing')
                .patchValue(c.marketing);
            } else {
              this.patientForm
                .get('communicationConsentSMSReminder')
                .patchValue(c.reminder);
              this.patientForm
                .get('communicationConsentSMSMarketing')
                .patchValue(c.marketing);
            }
          });
        });
    }
  }

  private populateData() {
    this.businessService
      .getLocationsByBusiness(this.appState.userProfile.parentBusinessId)
      .subscribe((locations) => {
        this.locationList = locations;
        const locationName = [];
        locationName.push(this.appState.selectedUserLocation);
        this.patientForm.get('locationName').patchValue(locationName);
      });

    this.miscService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });

    this.staffService.getPractitioners().subscribe((practitionersData) => {
      this.practitionerList = practitionersData;
      if (this.appState.selectedUserLocation !== undefined) {
        const pList = this.practitionerList.filter(
          (x) => x.locationId === this.appState.selectedUserLocation.id
        );

        if (pList.length > 0) {
          const pData = {
            id: pList[0].id,
            firstName: pList[0].firstName,
            locationId: this.appState.selectedUserLocation.id,
            locationName: this.appState.selectedUserLocation.locationName,
          };

          this.practitionerData.push(pData);
          this.practitionerDefault.push(pData);
        }
      }
    });

    this.settingsService
      .getAllMarketingSources()
      .subscribe((marketingSourcesData) => {
        this.marketingSources = marketingSourcesData;

        if (marketingSourcesData.length > 0) {
          marketingSourcesData.forEach((x) => {
            if (x.marketingSourceLocation.length > 0) {
              x.marketingSourceLocation.forEach((l) => {
                if (l.locationId === this.appState.selectedUserLocation.id) {
                  const data = {
                    id: x.id,
                    marketingName: x.marketingName,
                    locationId: this.appState.selectedUserLocation.id,
                    locationName: this.appState.selectedUserLocation
                      .locationName,
                  };

                  this.marketingSourcesData.push(data);
                }
              });
            }
          });
          this.marketingSourcesDataDefault = this.marketingSourcesData;
        }
      });

    this.settingsService.getAllConcessions().subscribe((concessionData) => {
      this.concessions = concessionData;

      if (concessionData.length > 0) {
        concessionData.forEach((x) => {
          if (x.concessionLocation.length > 0) {
            x.concessionLocation.forEach((l) => {
              if (l.locationId === this.appState.selectedUserLocation.id) {
                const data = {
                  id: x.id,
                  concessionType: x.concessionType,
                  locationId: this.appState.selectedUserLocation.id,
                  locationName: this.appState.selectedUserLocation.locationName,
                };

                this.concessionsData.push(data);
              }
            });
          }
        });
        this.concessionsDataDefault = this.concessionsData;
      }
    });
  }

  getAppData() {
    this.applicationDataService.getAllApplicationData().subscribe((data) => {
      this.appData = data;
      this.titleData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.title
      );
      this.patientStatusData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.patientStatus
      );
      this.patientPositionData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.patientPosition
      );
      this.patientClassificationData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.patientClassification
      );
      this.patientRelationshipData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.patientRelationship
      );
      this.patientOccupationData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.patientOccupation
      );
      this.cardTypeData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.cardType
      );
      this.healthFundNameData = this.appData.filter(
        (x) => x.categoryId === ApplicationDataEnum.healthFundName
      );
    });
  }

  disableDefault() {
    this.personalDetails = false;
    this.contactDetails = false;
    this.medicalDetails = false;
    this.employerDetails = false;
    this.marketingDetails = false;
    this.billingDetails = false;
    this.healthFundDetails = false;
  }

  clickPatientTabs(tab) {
    this.disableDefault();
    const ptabs = [];
    this.activeTab = this.patientTabs.filter((x) => x.active === true)[0].title;
    this.patientTabs.forEach((x) => {
      if (x.title === tab.title) {
        x.active = true;
      } else {
        x.active = false;
        if (x.title === this.activeTab) {
          x.validate = this.validateData(this.activeTab);
        }
      }
      ptabs.push(x);
    });

    this.patientTabs = ptabs;

    if (tab.title === 'Personal Details') {
      this.personalDetails = true;
    } else if (tab.title === 'Contact Details') {
      this.contactDetails = true;
    } else if (tab.title === 'Medical Details') {
      this.medicalDetails = true;
    } else if (tab.title === 'Employer Details') {
      this.employerDetails = true;
    } else if (tab.title === 'Marketing Details') {
      this.marketingDetails = true;
    } else if (tab.title === 'Billing Details') {
      this.billingDetails = true;
    } else if (tab.title === 'Health Fund Details') {
      this.healthFundDetails = true;
    }
  }

  validateData(title): number {
    if (title === 'Personal Details') {
      return (this.patientForm.get('title').value !== '' &&
        this.patientForm.get('gender').value !== '' &&
        this.patientForm.get('firstName').value !== '' &&
        this.patientForm.get('lastName').value !== '' &&
        this.patientForm.get('title').value !== '' &&
        this.patientForm.get('middleName').value !== '' &&
        this.patientForm.get('preferredName').value !== '' &&
        this.patientForm.get('dob').value !== '' &&
        this.patientForm.get('nationality').value !== '' &&
        this.patientForm.get('language').value !== '') === true
        ? 1
        : 2;
    }

    if (title === 'Contact Details') {
      return (this.patientForm.get('address').value !== '' &&
        this.patientForm.get('country').value !== '' &&
        this.patientForm.get('state').value !== '' &&
        this.patientForm.get('city').value !== '' &&
        this.patientForm.get('postCode').value !== '' &&
        this.patientForm.get('homePhone').value !== '' &&
        this.patientForm.get('workPhone').value !== '' &&
        this.patientForm.get('relationship').value !== '' &&
        this.patientForm.get('emergencyContactName').value !== '' &&
        this.patientForm.get('emergencyContactHomePhone').value !== '' &&
        this.patientForm.get('emergencyContactWorkPhone').value !== '' &&
        this.patientForm.get('emergencyContactMobile').value !== '' &&
        this.patientForm.get('emergencyContactEmail').value !== '') === true
        ? 1
        : 2;
    }

    if (title === 'Medical Details') {
      return (this.patientForm.get('medicalCondition').value !== '' &&
        this.patientForm.get('allergy').value !== '' &&
        this.patientForm.get('medication').value !== '') === true
        ? 1
        : 2;
    }

    if (title === 'Employer Details') {
      return (this.patientForm.get('employer').value !== '' &&
        this.patientForm.get('designation').value !== '' &&
        this.patientForm.get('occupation').value !== '') === true
        ? 1
        : 2;
    }

    if (title === 'Marketing Details') {
      return (this.patientForm.get('marketingSource').value !== '' &&
        this.patientForm.get('marketingSource').value !== null &&
        this.patientForm.get('communicationConsentSMSReminder').value !== '' &&
        this.patientForm.get('communicationConsentSMSMarketing').value !== '' &&
        this.patientForm.get('communicationConsentEmailReminder').value !==
          '' &&
        this.patientForm.get('communicationConsentEmailMarketing').value !==
          '') === true
        ? 1
        : 2;
    }

    if (title === 'Billing Details') {
      return (this.patientForm.get('concession').value !== '' &&
        this.patientForm.get('invoiceNotes').value !== '' &&
        this.patientForm.get('creditCardType').value !== '' &&
        this.patientForm.get('cardHolderName').value !== '' &&
        this.patientForm.get('creditCardNumber').value !== '' &&
        this.patientForm.get('expiryMonth').value !== '' &&
        this.patientForm.get('expiryYear').value !== '' &&
        this.patientForm.get('cvv').value !== '' &&
        this.patientForm.get('accountName').value !== '' &&
        this.patientForm.get('bsbCode').value !== '' &&
        this.patientForm.get('accountNumber').value !== '') === true
        ? 1
        : 2;
    }

    if (title === 'Health Fund Details') {
      return (this.patientMedicareHealthFund !== undefined ||
        this.patientMedicareHealthFund !== undefined ||
        this.patientHealthFund.length > 0) === true
        ? 1
        : 2;
    }
  }

  appIdTitleHandler($event) {
    this.titleId = $event;
  }

  appIdPatientStatusHandler($event) {
    this.patientStatusId = $event;
  }

  appIdPatientPositionHandler($event) {
    this.patientPositionId = $event;
  }

  appIdPatientClassificationHandler($event) {
    this.patientClassificationId = $event;
  }

  appIdPatientRelationshipHandler($event) {
    this.patientRelationshipId = $event;
  }

  appIdPatientOccupationHandler($event) {
    this.patientOccupationId = $event;
  }

  appIdCardTypeHandler($event) {
    this.cardTypeId = $event;
  }

  appIdHealthFundNameHandler($event) {
    this.healthFundNameId = $event;
    this.expandCss = 'col-xl-6';
    if (this.healthFundNameId === ApplicationDataEnum.Medicare) {
      this.medicareFlag = true;
      this.dvaFlag = false;
      this.otherFlag = false;
    } else if (this.healthFundNameId === ApplicationDataEnum.DVA) {
      this.medicareFlag = false;
      this.dvaFlag = true;
      this.otherFlag = false;
      this.addClaimantFlag = false;
    } else {
      this.medicareFlag = false;
      this.dvaFlag = false;
      this.otherFlag = true;
      this.addClaimantFlag = false;
    }
  }

  openSlider() {
    this.contact.emit('col-xl-12');
    document.getElementById('slider').style.width = '30%';
    document.getElementById('sliderShadow').style.display = 'block';
  }

  closeSlider() {
    document.getElementById('slider').style.width = '0px';
    document.getElementById('sliderShadow').style.display = 'none';
  }

  onLocationChange(locationData) {
    if (locationData.length === 0) {
      this.practitionerData = [];
      this.patientForm.get('practitionerName').patchValue('');
    } else {
      this.populatePractitioner(locationData);
      this.populateMarketingSource(locationData);
      this.populateConcession(locationData);
    }
  }

  populateConcession(locationData) {
    this.concessionsData = [];
    if (this.concessionsDataDefault.length > 0) {
      this.concessionsDataDefault.forEach((d) => {
        this.concessionsData.push(d);
      });
    }

    locationData.forEach((e) => {
      if (this.concessions.length > 0) {
        this.concessions.forEach((x) => {
          if (x.concessionLocation.length > 0) {
            x.concessionLocation.forEach((l) => {
              if (l.locationId === e.id) {
                const data = {
                  id: x.id,
                  concessionType: x.concessionType,
                  locationId: e.id,
                  locationName: e.locationName,
                };
                const d = this.concessionsData.filter((m) => m.id === x.id);
                if (d.length === 0) {
                  this.concessionsData.push(data);
                }
              }
            });
          }
        });
      }
    });
  }

  populateMarketingSource(locationData) {
    this.marketingSourcesData = [];
    if (this.marketingSourcesDataDefault.length > 0) {
      this.marketingSourcesDataDefault.forEach((d) => {
        this.marketingSourcesData.push(d);
      });
    }

    locationData.forEach((e) => {
      if (this.marketingSources.length > 0) {
        this.marketingSources.forEach((x) => {
          if (x.marketingSourceLocation.length > 0) {
            x.marketingSourceLocation.forEach((l) => {
              if (l.locationId === e.id) {
                const data = {
                  id: x.id,
                  marketingName: x.marketingName,
                  locationId: e.id,
                  locationName: e.locationName,
                };
                const d = this.marketingSourcesData.filter(
                  (m) => m.id === x.id
                );

                if (d.length === 0) {
                  this.marketingSourcesData.push(data);
                }
              }
            });
          }
        });
      }
    });
  }

  populatePractitioner(locationData) {
    this.practitionerData = [];
    locationData.forEach((e) => {
      const pList = this.practitionerList.find((x) => x.locationId === e.id);
      if (pList !== undefined) {
        const pData = {
          id: pList.id,
          firstName: pList.firstName,
          locationId: e.locationId,
          locationName: e.locationName,
        };

        const findData = this.practitionerData.find((x) => x.id === pData.id);
        if (findData === undefined) {
          this.practitionerData.push(pData);
        }
      }
    });

    if (this.practitionerDefault.length > 0) {
      this.practitionerDefault.forEach((x) => {
        const findData = this.practitionerData.find((t) => t.id === x.id);
        if (findData === undefined) {
          this.practitionerData.push(x);
        }
      });
    }
  }

  addNewFund(event: Event) {
    event.preventDefault();
    this.addNewFundFlag = true;
    this.expandCss = 'col-xl-12';
    this.otherFlag = true;
    this.addClaimantFlag = false;
    this.isFundAvaiable = true;
  }

  fillEmployer() {
    this.contactService.getAllContact().subscribe((data) => {
      this.employers = data.filter(
        (x) =>
          x.status === true &&
          x.contactType === 3 &&
          x.categoryId === ApplicationDataEnum.employer
      );
    });
  }

  addClaimant(event: Event, flag: boolean) {
    event.preventDefault();
    this.addClaimantFlag = flag;
    if (this.addClaimantFlag === false) {
      this.patientForm.get('claimantFirstName').patchValue('');
      this.patientForm.get('claimantLastName').patchValue('');
      this.patientForm.get('claimantDOB').patchValue('');
      this.patientForm.get('claimantMedicareNo').patchValue('');
      this.patientForm.get('claimantIrnUpi').patchValue('');
      this.patientMedicareHealthFund.claimantFirstName = undefined;
      this.patientMedicareHealthFund.claimantLastName = undefined;
      this.patientMedicareHealthFund.claimantDOB = undefined;
      this.patientMedicareHealthFund.claimantMedicareNo = undefined;
      this.patientMedicareHealthFund.claimantIrnUpi = undefined;
    }
  }

  cancelHealthFund() {
    this.cleanHealthFund();
  }
  saveFund() {
    if (
      this.patientMedicareHealthFund !== undefined &&
      (this.patientMedicareHealthFund.claimantFirstName === '' ||
        this.patientMedicareHealthFund.claimantFirstName === undefined)
    ) {
      this.patientMedicareHealthFund = undefined;
    }
    let model = new PatientHealthFundModel();
    if (
      this.healthFundNameId === ApplicationDataEnum.Medicare &&
      this.patientMedicareHealthFund === undefined
    ) {
      model.healthFundId = this.healthFundNameId;
      model.membershipNumber = this.patientForm.get('membershipNumber').value;
      model.irnUpi = this.patientForm.get('irnUpi').value;
      model.expiryMonth = this.patientForm.get('healthFundExpiryMonth').value;
      model.expiryYear = this.patientForm.get('healthFundExpiryYear').value;
      model.claimantFirstName = this.patientForm.get('claimantFirstName').value;
      model.claimantLastName = this.patientForm.get('claimantLastName').value;
      model.claimantDOB = this.patientForm.get('claimantDOB').value;
      model.claimantMedicareNo = this.patientForm.get(
        'claimantMedicareNo'
      ).value;
      model.claimantIrnUpi = this.patientForm.get('claimantIrnUpi').value;
      this.patientMedicareHealthFund = model;
    }

    if (
      this.healthFundNameId === ApplicationDataEnum.DVA &&
      this.patientDVAHealthFund === undefined
    ) {
      model = new PatientHealthFundModel();
      model.healthFundId = this.healthFundNameId;
      model.membershipNumber = this.patientForm.get('membershipNumber').value;
      model.cardType = this.patientForm.get('healthFundCardType').value;
      model.expiryMonth = this.patientForm.get('healthFundExpiryMonth').value;
      model.expiryYear = this.patientForm.get('healthFundExpiryYear').value;
      this.patientDVAHealthFund = model;
    }

    if (
      this.healthFundNameId !== ApplicationDataEnum.Medicare &&
      this.healthFundNameId !== ApplicationDataEnum.DVA
    ) {
      model = new PatientHealthFundModel();
      model.healthFundId = this.healthFundNameId;
      model.membershipNumber = this.patientForm.get('membershipNumber').value;
      model.irnUpi = this.patientForm.get('irnUpi').value;
      model.expiryMonth = this.patientForm.get('healthFundExpiryMonth').value;
      model.expiryYear = this.patientForm.get('healthFundExpiryYear').value;
      this.patientHealthFund.push(model);
    }
    this.cleanHealthFund();
    this.addNewFundFlag = false;
    this.isFundAvaiable = true;
  }

  private cleanHealthFund() {
    this.patientForm.get('healthFundId').patchValue('');
    this.patientForm.get('membershipNumber').patchValue('');
    this.patientForm.get('irnUpi').patchValue('');
    this.patientForm.get('healthFundExpiryMonth').patchValue('');
    this.patientForm.get('healthFundExpiryYear').patchValue('');
    this.patientForm.get('claimantFirstName').patchValue('');
    this.patientForm.get('claimantLastName').patchValue('');
    this.patientForm.get('claimantDOB').patchValue('');
    this.patientForm.get('claimantMedicareNo').patchValue('');
    this.patientForm.get('claimantIrnUpi').patchValue('');
    this.patientForm.get('healthFundCardType').patchValue('');
  }

  deleteOtherInsurance(membershipNumber) {
    const index = this.patientHealthFund.indexOf(membershipNumber);
    this.patientHealthFund.splice(index, 1);
  }

  editOtherInsurance(membershipNumber: PatientHealthFundModel) {
    this.patientForm
      .get('healthFundId')
      .patchValue(membershipNumber.healthFundId);
    this.patientForm
      .get('membershipNumber')
      .patchValue(membershipNumber.membershipNumber);
    this.patientForm.get('irnUpi').patchValue(membershipNumber.irnUpi);
    this.patientForm
      .get('healthFundExpiryMonth')
      .patchValue(membershipNumber.expiryMonth);
    this.patientForm
      .get('healthFundExpiryYear')
      .patchValue(membershipNumber.expiryYear);
    this.addNewFundFlag = true;
    this.addClaimantFlag = false;
    this.dvaFlag = false;
    this.healthFundNameId = membershipNumber.healthFundId;
  }

  deleteMedicare() {
    this.patientMedicareHealthFund = undefined;
  }

  editMedicare() {
    this.patientForm
      .get('healthFundId')
      .patchValue(this.patientMedicareHealthFund.healthFundId);
    this.patientForm
      .get('membershipNumber')
      .patchValue(this.patientMedicareHealthFund.membershipNumber);
    this.patientForm
      .get('irnUpi')
      .patchValue(this.patientMedicareHealthFund.irnUpi);
    this.patientForm
      .get('healthFundExpiryMonth')
      .patchValue(this.patientMedicareHealthFund.expiryMonth);
    this.patientForm
      .get('healthFundExpiryYear')
      .patchValue(this.patientMedicareHealthFund.expiryYear);
    this.patientForm
      .get('claimantFirstName')
      .patchValue(this.patientMedicareHealthFund.claimantFirstName);
    this.patientForm
      .get('claimantLastName')
      .patchValue(this.patientMedicareHealthFund.claimantLastName);
    this.patientForm
      .get('claimantDOB')
      .patchValue(this.patientMedicareHealthFund.claimantDOB);
    this.patientForm
      .get('claimantMedicareNo')
      .patchValue(this.patientMedicareHealthFund.claimantMedicareNo);
    this.patientForm
      .get('claimantIrnUpi')
      .patchValue(this.patientMedicareHealthFund.claimantIrnUpi);
    this.addNewFundFlag = true;
    this.addClaimantFlag = true;
    this.dvaFlag = false;
    this.healthFundNameId = this.patientMedicareHealthFund.healthFundId;
  }

  deleteDVA() {
    this.patientDVAHealthFund = undefined;
  }

  editDVA() {
    this.patientForm
      .get('healthFundId')
      .patchValue(this.patientDVAHealthFund.healthFundId);
    this.patientForm
      .get('membershipNumber')
      .patchValue(this.patientDVAHealthFund.membershipNumber);
    this.patientForm
      .get('healthFundCardType')
      .patchValue(this.patientDVAHealthFund.cardType);
    this.patientForm
      .get('healthFundExpiryMonth')
      .patchValue(this.patientDVAHealthFund.expiryMonth);
    this.patientForm
      .get('healthFundExpiryYear')
      .patchValue(this.patientDVAHealthFund.expiryYear);
    this.addNewFundFlag = true;
    this.addClaimantFlag = false;
    this.dvaFlag = true;
    this.healthFundNameId = this.patientDVAHealthFund.healthFundId;
  }

  cancel() {}
  submitPatient() {
    const el = document.getElementById('heading');
    const patientModel: PatientModel = this.patientForm.value;
    const locationsModel: PatientLocationModel[] = [];
    const healthFundModel: PatientHealthFundModel[] = [];
    const communicationModel: PatientCommunicationModel[] = [];

    if (this.image.selectedFile) {
      patientModel.patientPhoto = this.image.selectedFile.src
        .replace('data:', '')
        .replace(/^.+,/, '');
    }

    if (patientModel.locationName !== '') {
      patientModel.locationName.forEach((l) => {
        const m = new PatientLocationModel();
        m.locationId = l.id;
        m.patientId = this.itemid;
        locationsModel.push(m);
      });
    }

    let model = new PatientCommunicationModel();
    model.communicationType = 'SMS';
    model.reminder = this.patientForm.get(
      'communicationConsentSMSReminder'
    ).value;
    model.marketing = this.patientForm.get(
      'communicationConsentSMSReminder'
    ).value;
    model.patientId = this.itemid;
    communicationModel.push(model);
    model = new PatientCommunicationModel();
    model.communicationType = 'Email';
    model.reminder = this.patientForm.get(
      'communicationConsentEmailReminder'
    ).value;
    model.marketing = this.patientForm.get(
      'communicationConsentEmailMarketing'
    ).value;
    model.patientId = this.itemid;
    communicationModel.push(model);

    if (this.patientDVAHealthFund !== undefined) {
      const m = new PatientHealthFundModel();
      m.healthFundId = this.patientDVAHealthFund.healthFundId;
      m.membershipNumber = this.patientDVAHealthFund.membershipNumber;
      m.cardType = this.patientDVAHealthFund.cardType;
      m.expiryMonth = this.patientDVAHealthFund.expiryMonth;
      m.expiryYear = this.patientDVAHealthFund.expiryYear;
      healthFundModel.push(m);
    }

    if (this.patientMedicareHealthFund !== undefined) {
      const m = new PatientHealthFundModel();
      m.healthFundId = this.patientMedicareHealthFund.healthFundId;
      m.membershipNumber = this.patientMedicareHealthFund.membershipNumber;
      m.irnUpi = this.patientMedicareHealthFund.irnUpi;
      m.expiryMonth = this.patientMedicareHealthFund.expiryMonth;
      m.expiryYear = this.patientMedicareHealthFund.expiryYear;
      m.claimantFirstName = this.patientMedicareHealthFund.claimantFirstName;
      m.claimantLastName = this.patientMedicareHealthFund.claimantLastName;
      m.claimantDOB = this.patientMedicareHealthFund.claimantDOB;
      m.claimantMedicareNo = this.patientMedicareHealthFund.claimantMedicareNo;
      m.claimantIrnUpi = this.patientMedicareHealthFund.claimantIrnUpi;
      healthFundModel.push(m);
    }

    if (this.patientHealthFund.length > 0) {
      this.patientHealthFund.forEach((x) => {
        const m = new PatientHealthFundModel();
        m.healthFundId = x.healthFundId;
        m.membershipNumber = x.membershipNumber;
        m.irnUpi = x.irnUpi;
        m.expiryMonth = x.expiryMonth;
        m.expiryYear = x.expiryYear;
        healthFundModel.push(m);
      });
    }

    patientModel.patientLocation = locationsModel;
    patientModel.patientCommunication = communicationModel;
    patientModel.patientHealthFund = healthFundModel;
    patientModel.locationId = this.appState.selectedUserLocation.id;

    patientModel.title = this.titleId;
    patientModel.patientStatus = this.patientStatusId;
    patientModel.patientClassification = this.patientClassificationId;
    patientModel.position = this.patientPositionId;
    patientModel.relationship = this.patientRelationshipId;
    patientModel.occupation = this.patientOccupationId;
    patientModel.creditCardType = this.cardTypeId;

    if (!this.patientForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      if (this.addItem) {
        this.patientService.createPatient(patientModel).subscribe(
          () => {
            this.submitting = false;
            this.patientService.sharedData = 'Patient added successfully.';
            this.router.navigate(['/patients']);
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while adding Patient, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      } else {
        patientModel.id = this.patientId;
        this.patientService.updatePatient(patientModel).subscribe(
          () => {
            this.submitting = false;
            this.patientService.sharedData = 'Patient updated successfully.';
            this.router.navigate(['/patients']);
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while updating Patient, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      }
    }
  }

  verifyClaimant() {}
  verifyPatient() {}
  getFundList() {}
  public onAddressSearchChange(e): void {
    if (e.length > 10) {
      this.miscService
        .getAddress(e + ' Australia')
        .then((response) => {
          this.addressData = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  handleEmployerChange(e) {
    const emp = this.employers.filter((x) => x.id === e);
    this.filleSelectedEmployer(emp[0]);
  }

  parentProductCallBack(e) {
    this.patientForm.get('employer').patchValue(e);
    this.contactService.getAllContact().subscribe((data) => {
      const emp = data.filter(
        (x) =>
          x.status === true &&
          x.contactType === 3 &&
          x.categoryId === ApplicationDataEnum.employer &&
          x.id === e
      );
      this.filleSelectedEmployer(emp[0]);
    });
  }

  private filleSelectedEmployer(emp) {
    if (emp !== undefined) {
      this.patientForm
        .get('employerDepartmentName')
        .patchValue(emp.departmentName);
      this.patientForm
        .get('employerContactPerson')
        .patchValue(emp.firstName + ' ' + emp.lastName);
      this.patientForm.get('employerWorkPhone').patchValue(emp.workPhone);
      this.patientForm.get('employerEmail').patchValue(emp.emailId);
    }
  }

  dateOfBirthchange(e) {
    let years = 0;
    let months = 0;
    if (e !== null) {
      const currentDate = new Date();
      const dateSent = new Date(e);
      let dateCount = Math.floor(
        (Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ) -
          Date.UTC(
            dateSent.getFullYear(),
            dateSent.getMonth(),
            dateSent.getDate()
          )) /
          (1000 * 60 * 60 * 24)
      );

      if (dateCount > 365) {
        const m = Math.floor(dateCount / 30);
        years = Math.floor(m / 12);
        dateCount = dateCount - years * 365;
      }

      if (dateCount > 30) {
        months = Math.floor(dateCount / 30);
      }
    }
    this.patientForm
      .get('dobDisable')
      .patchValue(years + ' years ' + months + ' months');
  }

  membershipNumberChange(e) {
    if (
      this.healthFundNameId === ApplicationDataEnum.Medicare &&
      !medicareCardCheck(e)
    ) {
      this.patientForm
        .get('membershipNumber')
        .setErrors({ 'server-error': 'Invalid Medicare Membership Number' });
    } else if (
      this.healthFundNameId === ApplicationDataEnum.DVA &&
      !dvaCardCheck(e)
    ) {
      this.patientForm
        .get('membershipNumber')
        .setErrors({ 'server-error': 'Invalid DVA Membership Number' });
    }
  }

  cardValidatorChange(e) {
    if (
      this.patientForm.get('creditCardNumber').value !== '' &&
      !cardCheck(e)
    ) {
      this.patientForm
        .get('creditCardNumber')
        .setErrors({ 'server-error': 'Invalid credit Card Number' });
    }
  }
}
