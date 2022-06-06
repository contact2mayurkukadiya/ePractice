import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { OfferingsService } from 'src/app/services/app.offerings.service';
import { SettingsService } from 'src/app/services/app.settings.service';
import { StaffService } from 'src/app/services/app.staff.service';

import { ApplicationDataService } from 'src/app/services/app.applicationdata.service';
import { AppState } from 'src/app/app.state';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import { ImageSnippet } from '../../models/app.misc';
import {
  ServiceModel,
  ServiceLocationModel,
  ServiceSpecialtyModel,
  ServicePractitionerModel,
  ServiceRelatedProductModel,
  ServiceTreatmentNotesTemplateModel,
  ServiceConcessionModel,
} from '../../models/app.service.model';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ApplicationDataEnum } from '../../enum/application-data-enum';
import { ApplicationDataModel } from '../../models/app.misc';
import { GroupResult, groupBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
})
export class AddServiceComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(ImageUploadComponent, { static: true })
  image: ImageUploadComponent;

  submitting = false;

  serviceForm: FormGroup = new FormGroup({
    serviceLogo: new FormControl(''),
    colour: new FormControl(''),
    locationName: new FormControl('', Validators.required),
    specialtyName: new FormControl('', Validators.required),
    practitionerName: new FormControl('', Validators.required),
    serviceCode: new FormControl('', Validators.required),
    medicareCode: new FormControl(''),
    dvaCode: new FormControl(''),
    serviceName: new FormControl('', Validators.required),
    description: new FormControl(''),
    categoryId: new FormControl(''),
    productName: new FormControl(''),
    treatmentNotesTemplate: new FormControl(''),
    duration: new FormControl(''),
    standardPrice: new FormControl('', Validators.required),
    taxTypeId: new FormControl(''),
    taxOptionId: new FormControl(0),
    onlineBooking: new FormControl(true),
    status: new FormControl(true),
  });

  public selectedCategory: any;
  locationList: any[];
  categories: any[];
  concessionList: any[];
  concessions: any[];
  concessionAllList: any[];
  specialtyAllList: any[];
  practitionerAllList: any[];
  taxTypes: any[];
  taxOptions: any[];
  apperance = 'outline';
  addService = true;
  catData: any[];
  public selectedCategoryName: any[];

  specialtyEnable = true;
  practitionerEnable = true;
  locationEnable = false;
  concessionsEnable = false;

  addItem: boolean;
  itemid: any;
  public categorySelect: string;
  public taxTypeSelect: string;
  public taxOptionSelect: string;
  public selectionTaxOption: string;
  public filter: string;
  selectedColour: string;
  products: any[];
  categoryId: number;
  public specialtyData: any[] = [];
  public groupedSpecialtyData: GroupResult[];
  public practitionerData: any[] = [];
  public groupedPractitionerData: GroupResult[];
  specialtyDataTemp: any[] = [];
  practitionerDataTemp: any[] = [];
  taxOptionHide = true;

  constructor(
    private appState: AppState,
    public location: Location,
    private _route: ActivatedRoute,
    private offeringsService: OfferingsService,
    private settingsService: SettingsService,
    private businessService: BusinessService,
    private staffService: StaffService,
    private applicationDataService: ApplicationDataService
  ) {
    super(location);
    this.fillCategory();
    this.fillTaxOption();
    this.fillTaxTypes();
  }

  ngOnInit() {
    this.businessService
      .getLocationsByBusiness(this.appState.userProfile.parentBusinessId)
      .subscribe((locations) => {
        this.locationList = locations;
      });

    this.settingsService.getAllConcessions().subscribe((concessionData) => {
      this.concessionList = this.concessionAllList = concessionData;
    });

    this.settingsService.getAllSpecialties().subscribe((specialtyData) => {
      this.specialtyAllList = specialtyData;
    });

    this.staffService.getPractitioners().subscribe((practitionersData) => {
      this.practitionerAllList = practitionersData;
    });

    this.offeringsService.getAllProducts().subscribe((productsData) => {
      this.products = productsData.filter((x) => x.status === true);

      this._route.params.subscribe((params) => {
        if (params.serviceId) {
          this.blockUI.start();
          this.addItem = false;
          this.itemid = params.serviceId;

          this.offeringsService
            .getServiceById(params.serviceId)
            .subscribe((data: ServiceModel) => {
              this.serviceForm.patchValue(data);
              if (data.serviceLogo) {
                this.image.selectedFile = new ImageSnippet(
                  `data:image/jpeg;base64,${data.serviceLogo}`,
                  null
                );
              }
              this.selectedColour = data.colour;

              const locationName = [];
              data.serviceLocation.forEach((pl) => {
                locationName.push(
                  this.locationList.find((l) => l.id === pl.locationId)
                );
              });
              this.populateSpecialty(locationName);

              this.serviceForm.get('locationName').patchValue(locationName);
              this.handleTaxTypeChange(data.taxTypeId);
              this.locationEnable = false;
              this.specialtyEnable = false;

              const specialtyName = [];
              data.serviceSpecialty.forEach((s) => {
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

              this.serviceForm
                .get('specialtyName')
                .patchValue(this.specialtyDataTemp);

              this.populatePractitioner(this.specialtyDataTemp);

              data.servicePractitioner.forEach((p) => {
                const location = this.locationList.filter(
                  (x) => x.id === p.locationId
                );
                const specialty = this.specialtyAllList.filter(
                  (x) => x.id === p.specialtyId
                );
                const practitioner = this.practitionerAllList.filter(
                  (x) => x.id === p.practitionerId
                );

                const sData = {
                  id: p.practitionerId,
                  idAndSpecialtyIdAndLocationId:
                    p.practitionerId + p.specialtyId + p.locationId,
                  firstName:
                    practitioner[0].firstName +
                    ' (' +
                    location[0].locationName +
                    ')',
                  specialtyId: p.specialtyId,
                  specialtyName: specialty[0].specialtyName,
                  locationId: p.locationId,
                  locationName: location[0].locationName,
                };

                this.practitionerDataTemp.push(sData);
              });

              if (this.practitionerDataTemp.length > 0) {
                this.practitionerEnable = false;
              }

              this.serviceForm
                .get('practitionerName')
                .patchValue(this.practitionerDataTemp);

              const productName = [];
              data.serviceRelatedProduct.forEach((rp) => {
                productName.push(
                  this.products.find((p) => p.id === rp.productId)
                );
              });
              this.serviceForm.get('productName').patchValue(productName);

              this.categoryId = data.categoryId;
              this.concessions = [];
              if (data.serviceConcession.length > 0) {
                this.concessionsEnable = true;
                data.serviceConcession.forEach((c) => {
                  const model = new ServiceConcessionModel();
                  model.concessionId = c.concessionId;
                  model.concessionAmount = c.concessionAmount;
                  model.concessionType = this.concessionAllList.filter(
                    (x) => x.id === c.concessionId
                  )[0].concessionType;
                  model.locationName = this.locationList.filter(
                    (x) => x.id === c.locationId
                  )[0].locationName;
                  model.locationId = c.locationId;
                  model.serviceId = c.serviceId;
                  model.isStatus = c.isStatus;
                  this.concessions.push(model);
                });
              }
              this.populateConcession(locationName);
            });
          this.blockUI.stop();
        }
      });
    });
  }

  public onColourChange(color: string): void {
    this.selectedColour = color;
  }

  handleFilter(value) {
    this.catData = this.categories.filter(
      (s) => s.categoryName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.filter = value;
  }

  handleCategoryChange(value) {
    this.categoryId = value;
  }

  fillCategory() {
    this.applicationDataService
      .getApplicationDataByCategoryId(ApplicationDataEnum.serviceCategory)
      .subscribe((data) => {
        this.categories = this.catData = data;
      });
  }

  fillTaxOption() {
    this.applicationDataService
      .getApplicationDataByCategoryId(ApplicationDataEnum.taxOption)
      .subscribe((data) => {
        this.taxOptions = data;
      });
  }


  fillTaxTypes() {
    this.settingsService.getAllTaxes().subscribe((data) => {
      this.taxTypes = data;
    });
  }

  createService() {
    const el = document.getElementById('heading');
    const serviceModel: ServiceModel = this.serviceForm.value;
    const locations: ServiceLocationModel[] = [];
    const specialty: ServiceSpecialtyModel[] = [];
    const practitioner: ServicePractitionerModel[] = [];
    const relatedProduct: ServiceRelatedProductModel[] = [];
    // const treatmentNotesTemplate: ServiceTreatmentNotesTemplateModel[] = [];
    const concession: ServiceConcessionModel[] = [];

    if (!this.serviceForm.invalid) {
      this.blockUI.start();
      this.submitting = true;

      if (this.image.selectedFile) {
        serviceModel.serviceLogo = this.image.selectedFile.src
          .replace('data:', '')
          .replace(/^.+,/, '');
      }

      if (serviceModel.locationName !== '') {
        serviceModel.locationName.forEach((l) => {
          const model = new ServiceLocationModel();
          model.locationId = l.id;
          model.serviceId = this.itemid;
          locations.push(model);
        });
      }

      if (serviceModel.specialtyName !== '') {
        serviceModel.specialtyName.forEach((s) => {
          const model = new ServiceSpecialtyModel();
          model.locationId = s.locationId;
          model.specialtyId = s.id;
          model.serviceId = this.itemid;
          specialty.push(model);
        });
      }

      if (serviceModel.practitionerName !== '') {
        serviceModel.practitionerName.forEach((p) => {
          const model = new ServicePractitionerModel();
          model.locationId = p.locationId;
          model.specialtyId = p.specialtyId;
          model.practitionerId = p.id;
          model.serviceId = this.itemid;
          practitioner.push(model);
        });
      }

      if (serviceModel.productName !== '') {
        serviceModel.productName.forEach((rp) => {
          const model = new ServiceRelatedProductModel();
          model.productId = rp.id;
          model.serviceId = this.itemid;
          relatedProduct.push(model);
        });
      }

      if (this.concessionList.length > 0) {
        this.concessionList.forEach((c) => {
          const model = new ServiceConcessionModel();
          model.concessionId = c.id;
          model.locationId = c.locationId;
          model.concessionAmount = Number(
            (document.getElementById(
              c.locationId + c.concessionType
            ) as HTMLInputElement).value
          );
          model.serviceId = this.itemid;
          concession.push(model);
        });
      }

      serviceModel.serviceLocation = locations;
      serviceModel.serviceSpecialty = specialty;
      serviceModel.servicePractitioner = practitioner;
      serviceModel.serviceRelatedProduct = relatedProduct;
      serviceModel.serviceConcession = concession;
      serviceModel.colour = this.selectedColour;
      serviceModel.categoryId = Number(this.categoryId);
      serviceModel.taxTypeId = serviceModel.taxTypeId;

      if (this.taxOptionHide === true && serviceModel.taxOptionId === 0) {
        this.displayErrorMessage(
          'Error occurred while adding Service, please try again.'
        );
        this.blockUI.stop();
        el.scrollIntoView();
        this.submitting = false;
        return;
      }

      if (this.addItem) {
        this.offeringsService.createService(serviceModel).subscribe(
          () => {
            this.submitting = false;
            this.displaySuccessMessage('Service added successfully.');
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while adding Service, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      } else {
        serviceModel.id = this.itemid;
        this.offeringsService.updateService(serviceModel).subscribe(
          () => {
            this.submitting = false;
            this.displaySuccessMessage('Service updated successfully.');
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while updating Service, please try again.'
            );
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
      this.groupedPractitionerData = groupBy([], [{ field: 'specialtyName' }]);
      this.specialtyEnable = true;
      this.practitionerEnable = true;
      this.specialtyData = [];
      this.practitionerData = [];
      this.serviceForm.get('specialtyName').patchValue('');
      this.serviceForm.get('practitionerName').patchValue('');
    } else {
      this.removeSpecialty(locationData);
      this.populateSpecialty(locationData);
      this.populateConcession(locationData);
    }
  }

  removeSpecialty(locationData) {
    this.specialtyDataTemp = [];
    const specialtyNameData = this.serviceForm.get('specialtyName').value;
    if (specialtyNameData.length > 0) {
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
      this.serviceForm.get('specialtyName').patchValue(this.specialtyDataTemp);
    }
  }

  removePractitioner(specialtyData) {
    this.practitionerDataTemp = [];
    const practitionerNameData = this.serviceForm.get('practitionerName').value;
    if (practitionerNameData.length > 0) {
      specialtyData.forEach((e) => {
        const practitioner = practitionerNameData.filter(
          (x) => x.locationId === e.locationId && x.specialtyId === e.id
        );

        practitioner.forEach((element) => {
          const sData = {
            id: element.id,
            idAndSpecialtyIdAndLocationId:
              element.idAndSpecialtyIdAndLocationId,
            firstName: element.firstName,
            specialtyId: element.specialtyId,
            specialtyName: element.specialtyName,
            locationId: element.locationId,
            locationName: element.locationName,
          };

          this.practitionerDataTemp.push(sData);
        });
      });
      this.serviceForm
        .get('practitionerName')
        .patchValue(this.practitionerDataTemp);

      if (this.practitionerDataTemp.length > 0) {
        this.practitionerEnable = false;
      } else {
        this.practitionerEnable = true;
        this.practitionerData = [];
        this.groupedPractitionerData = groupBy(
          [],
          [{ field: 'specialtyName' }]
        );
        this.serviceForm.get('practitionerName').patchValue('');
      }
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

      this.removePractitioner(this.specialtyData);
    });

    if (this.specialtyData.length > 0) {
      this.specialtyEnable = false;
    } else {
      this.specialtyEnable = true;
    }
  }

  populateConcession(locationData) {
    this.concessionList = [];

    locationData.forEach((e) => {
      this.concessionAllList.forEach((s) => {
        const cLocation = s.concessionLocation.filter(
          (x) => x.locationId === e.id
        );

        if (cLocation.length > 0) {
          cLocation.forEach((cl) => {
            let cAmount = 0;
            if (this.concessions !== undefined && this.concessions.length > 0) {
              const cList = this.concessions.filter(
                (x) => x.locationId === cl.locationId && x.id === s.concessionId
              );
              if (cList.length > 0) {
                cAmount = cList[0].concessionAmount;
              }
            }
            const sData = {
              id: s.id,
              locationId: cl.locationId,
              concessionAmount: cAmount,
              concessionType: s.concessionType,
              serviceId: '',
              locationName: cl.locationName,
            };

            this.concessionList.push(sData);
          });
          this.concessionsEnable = true;
        }
      });
    });
    if (this.concessionList.length === 0) {
      this.concessionsEnable = false;
    }
  }

  onSpecialtyChange(specialtyData) {
    if (specialtyData.length === 0) {
      this.practitionerEnable = true;
      this.practitionerData = [];
      this.groupedPractitionerData = groupBy([], [{ field: 'specialtyName' }]);
      this.serviceForm.get('practitionerName').patchValue('');
    } else {
      this.removePractitioner(specialtyData);
      this.populatePractitioner(specialtyData);
    }
  }

  populatePractitioner(specialtyData) {
    specialtyData.forEach((e) => {
      const pList = this.practitionerAllList.filter(
        (x) => x.specialtyId === e.id && x.locationId === e.locationId
      );
      if (pList !== undefined && pList.length > 0) {
        pList.forEach((p) => {
          const lName = this.locationList.filter((x) => x.id === p.locationId);
          const sName = this.specialtyAllList.filter(
            (x) => x.id === p.specialtyId
          );

          const d = this.practitionerData.filter(
            (x) =>
              x.id + x.specialtyId + x.locationId ===
              p.id + p.specialtyId + p.locationId
          );

          if (d.length === 0) {
            const pData = {
              id: p.id,
              idAndSpecialtyIdAndLocationId:
                p.id + p.specialtyId + p.locationId,
              firstName: p.firstName + ' (' + lName[0].locationName + ')',
              specialtyId: p.specialtyId,
              specialtyName: sName[0].specialtyName,
              locationId: p.locationId,
              locationName: lName[0].locationName,
            };

            this.practitionerData.push(pData);
          }
        });
      }
    });
    if (this.practitionerData.length > 0) {
      this.groupedPractitionerData = groupBy(this.practitionerData, [
        { field: 'specialtyName' },
      ]);
      this.practitionerEnable = false;
    } else {
      this.practitionerEnable = true;
    }
  }

  handleTaxTypeChange(e) {
    const tt = this.taxTypes.filter(x => x.id === e);
    if (tt[0].taxType.toLowerCase() === "no tax") {
      this.taxOptionHide = false;
      this.serviceForm.get('taxOptionId').patchValue(0);
    } else {
      this.taxOptionHide = true;
    }
  }

  public addNew(): void {
    this.applicationDataService
      .createApplicationData(
        new ApplicationDataModel(
          0,
          this.filter,
          ApplicationDataEnum.serviceCategory,
          true
        )
      )
      .subscribe(
        (d) => {
          this.categoryId = d;
          this.categories.push(
            new ApplicationDataModel(
              this.categoryId,
              this.filter,
              ApplicationDataEnum.serviceCategory,
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
