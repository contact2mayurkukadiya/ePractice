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
  ClassModel,
  ClassLocationModel,
  ClassSpecialtyModel,
  ClassPractitionerModel,
  ClassRelatedProductModel,
  ClassConcessionModel,
} from '../../models/app.class.model';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ApplicationDataEnum } from '../../enum/application-data-enum';
import { ApplicationDataModel } from '../../models/app.misc';
import { GroupResult, groupBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css'],
})
export class AddClassComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(ImageUploadComponent, { static: true })
  image: ImageUploadComponent;

  submitting = false;

  classForm: FormGroup = new FormGroup({
    classLogo: new FormControl(''),
    colour: new FormControl(''),
    locationName: new FormControl('', Validators.required),
    specialtyName: new FormControl('', Validators.required),
    practitionerName: new FormControl('', Validators.required),
    classCode: new FormControl('', Validators.required),
    medicareCode: new FormControl(''),
    dvaCode: new FormControl(''),
    className: new FormControl('', Validators.required),
    description: new FormControl(''),
    categoryId: new FormControl(''),
    productName: new FormControl(''),
    duration: new FormControl(''),
    maximumParticipants: new FormControl(''),
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
  addClass = true;
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
        if (params.classId) {
          this.blockUI.start();
          this.addItem = false;
          this.itemid = params.classId;

          this.offeringsService
            .getClassById(params.classId)
            .subscribe((data: ClassModel) => {
              this.classForm.patchValue(data);
              if (data.classLogo) {
                this.image.selectedFile = new ImageSnippet(
                  `data:image/jpeg;base64,${data.classLogo}`,
                  null
                );
              }
              this.selectedColour = data.colour;

              const locationName = [];
              data.classLocation.forEach((pl) => {
                locationName.push(
                  this.locationList.find((l) => l.id === pl.locationId)
                );
              });
              this.populateSpecialty(locationName);

              this.classForm.get('locationName').patchValue(locationName);
              this.handleTaxTypeChange(data.taxTypeId);
              this.locationEnable = false;
              this.specialtyEnable = false;

              const specialtyName = [];
              data.classSpecialty.forEach((s) => {
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

              this.classForm
                .get('specialtyName')
                .patchValue(this.specialtyDataTemp);

              this.populatePractitioner(this.specialtyDataTemp);

              data.classPractitioner.forEach((p) => {
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

              this.classForm
                .get('practitionerName')
                .patchValue(this.practitionerDataTemp);

              const productName = [];
              data.classRelatedProduct.forEach((rp) => {
                productName.push(
                  this.products.find((p) => p.id === rp.productId)
                );
              });
              this.classForm.get('productName').patchValue(productName);

              this.categoryId = data.categoryId;
              this.concessions = [];
              if (data.classConcession.length > 0) {
                this.concessionsEnable = true;
                data.classConcession.forEach((c) => {
                  const model = new ClassConcessionModel();
                  model.concessionId = c.concessionId;
                  model.concessionAmount = c.concessionAmount;
                  model.concessionType = this.concessionAllList.filter(
                    (x) => x.id === c.concessionId
                  )[0].concessionType;
                  model.locationName = this.locationList.filter(
                    (x) => x.id === c.locationId
                  )[0].locationName;
                  model.locationId = c.locationId;
                  model.classId = c.classId;
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
      .getApplicationDataByCategoryId(ApplicationDataEnum.classCategory)
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

  createClass() {
    const el = document.getElementById('heading');
    const classModel: ClassModel = this.classForm.value;
    const locations: ClassLocationModel[] = [];
    const specialty: ClassSpecialtyModel[] = [];
    const practitioner: ClassPractitionerModel[] = [];
    const relatedProduct: ClassRelatedProductModel[] = [];
    const concession: ClassConcessionModel[] = [];

    if (!this.classForm.invalid) {
      this.blockUI.start();
      this.submitting = true;

      if (this.image.selectedFile) {
        classModel.classLogo = this.image.selectedFile.src
          .replace('data:', '')
          .replace(/^.+,/, '');
      }

      if (classModel.locationName !== '') {
        classModel.locationName.forEach((l) => {
          const model = new ClassLocationModel();
          model.locationId = l.id;
          model.classId = this.itemid;
          locations.push(model);
        });
      }

      if (classModel.specialtyName !== '') {
        classModel.specialtyName.forEach((s) => {
          const model = new ClassSpecialtyModel();
          model.locationId = s.locationId;
          model.specialtyId = s.id;
          model.classId = this.itemid;
          specialty.push(model);
        });
      }

      if (classModel.practitionerName !== '') {
        classModel.practitionerName.forEach((p) => {
          const model = new ClassPractitionerModel();
          model.locationId = p.locationId;
          model.specialtyId = p.specialtyId;
          model.practitionerId = p.id;
          model.classId = this.itemid;
          practitioner.push(model);
        });
      }

      if (classModel.productName !== '') {
        classModel.productName.forEach((rp) => {
          const model = new ClassRelatedProductModel();
          model.productId = rp.id;
          model.classId = this.itemid;
          relatedProduct.push(model);
        });
      }

      if (this.concessionList.length > 0) {
        this.concessionList.forEach((c) => {
          const model = new ClassConcessionModel();
          model.concessionId = c.id;
          model.locationId = c.locationId;
          model.concessionAmount = Number(
            (document.getElementById(
              c.locationId + c.concessionType
            ) as HTMLInputElement).value
          );
          model.classId = this.itemid;
          concession.push(model);
        });
      }

      classModel.classLocation = locations;
      classModel.classSpecialty = specialty;
      classModel.classPractitioner = practitioner;
      classModel.classRelatedProduct = relatedProduct;
      classModel.classConcession = concession;
      classModel.colour = this.selectedColour;
      classModel.categoryId = Number(this.categoryId);
      classModel.taxTypeId = classModel.taxTypeId;

      if (this.taxOptionHide === true && classModel.taxOptionId === 0) {
        this.displayErrorMessage(
          'Error occurred while adding class, please try again.'
        );
        this.blockUI.stop();
        el.scrollIntoView();
        this.submitting = false;
        return;
      }

      if (this.addItem) {
        this.offeringsService.createClass(classModel).subscribe(
          () => {
            this.submitting = false;
            this.displaySuccessMessage('Class added successfully.');
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while adding Class, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      } else {
        classModel.id = this.itemid;
        this.offeringsService.updateClass(classModel).subscribe(
          () => {
            this.submitting = false;
            this.displaySuccessMessage('Class updated successfully.');
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while updating Class, please try again.'
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
      this.classForm.get('specialtyName').patchValue('');
      this.classForm.get('practitionerName').patchValue('');
    } else {
      this.removeSpecialty(locationData);
      this.populateSpecialty(locationData);
      this.populateConcession(locationData);
    }
  }

  removeSpecialty(locationData) {
    this.specialtyDataTemp = [];
    const specialtyNameData = this.classForm.get('specialtyName').value;
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
      this.classForm.get('specialtyName').patchValue(this.specialtyDataTemp);
    }
  }

  removePractitioner(specialtyData) {
    this.practitionerDataTemp = [];
    const practitionerNameData = this.classForm.get('practitionerName').value;
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
      this.classForm
        .get('practitionerName')
        .patchValue(this.practitionerDataTemp);

      if (this.practitionerDataTemp.length > 0) {
        this.practitionerEnable = false;
      } else {
        this.practitionerEnable = true;
        this.practitionerData = [];
        this.groupedPractitionerData = groupBy([], [{ field: 'specialtyName' }]);
        this.classForm.get('practitionerName').patchValue('');
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
              classId: '',
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
      this.classForm.get('practitionerName').patchValue('');
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
      this.classForm.get('taxOptionId').patchValue(0);
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
          ApplicationDataEnum.classCategory,
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
              ApplicationDataEnum.classCategory,
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
