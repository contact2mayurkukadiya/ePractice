import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/app.business.service';
import { OfferingsService } from '../../services/app.offerings.service';
import { SettingsService } from 'src/app/services/app.settings.service';
import { ApplicationDataService } from 'src/app/services/app.applicationdata.service';
import { AppState } from 'src/app/app.state';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import { ImageSnippet } from '../../models/app.misc';
import {
  ProductModel,
  ProductLocationModel,
} from '../../models/app.product.model';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ApplicationDataEnum } from '../../enum/application-data-enum';
import { ContactService } from '../../services/app.contact.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(ImageUploadComponent, { static: true })
  image: ImageUploadComponent;
  @Output() appId: EventEmitter<number> = new EventEmitter<number>();

  submitting = false;
  public contact: EventEmitter<string> = new EventEmitter();

  productForm: FormGroup = new FormGroup({
    productLogo: new FormControl(''),
    productCode: new FormControl('', Validators.required),
    medicareCode: new FormControl(''),
    dvaCode: new FormControl(''),
    productName: new FormControl('', Validators.required),
    description: new FormControl(''),
    supplierId: new FormControl(''),
    serialNumber: new FormControl(''),
    unitOfMeasurement: new FormControl(''),
    currentStock: new FormControl('', Validators.required),
    minimumStock: new FormControl('', Validators.required),
    costPrice: new FormControl('', Validators.required),
    salePrice: new FormControl('', Validators.required),
    taxTypeId: new FormControl(''),
    taxOptionId: new FormControl(0),
    locationName: new FormControl('', Validators.required),
    status: new FormControl(true),
  });

  locationList: any[];
  taxTypes: any[];
  taxOptions: any[];
  suppliers: any[];
  apperance = 'outline';
  addProduct = true;
  taxOptionHide = true;
  public supplierFilter: string;

  addItem: boolean;
  itemid: any;
  unitOfMeasurement: number;
  unitOfMeasurementParentId: number;

  constructor(
    private businessService: BusinessService,
    private appState: AppState,
    public location: Location,
    private _route: ActivatedRoute,
    public offeringsService: OfferingsService,
    public contactService: ContactService,
    public settingsService: SettingsService,
    public applicationDataService: ApplicationDataService
  ) {
    super(location);
    this.fillTaxOption();
    this.fillSupplierName();
    this.fillTaxTypes();
    this.unitOfMeasurementParentId = ApplicationDataEnum.unitOfMeasurement;
  }

  ngOnInit() {
    this.businessService
      .getLocationsByBusiness(this.appState.userProfile.parentBusinessId)
      .subscribe((locations) => {
        this.locationList = locations;
      });

    this._route.params.subscribe((params) => {
      if (params.productId) {
        this.blockUI.start();
        this.addItem = false;
        this.itemid = params.productId;

        this.offeringsService
          .getProductById(params.productId)
          .subscribe((data: ProductModel) => {
            this.productForm.patchValue(data);
            if (data.productLogo) {
              this.image.selectedFile = new ImageSnippet(
                `data:image/jpeg;base64,${data.productLogo}`,
                null
              );
            }
            const locationName = [];
            data.productLocation.forEach((pl) => {
              locationName.push(
                this.locationList.find((l) => l.id === pl.locationId)
              );
            });

            this.unitOfMeasurement = data.unitOfMeasurement;
            this.productForm.get('locationName').patchValue(locationName);
            this.handleTaxTypeChange(data.taxTypeId);
          });
        this.blockUI.stop();
      }
    });
  }

  appIdUnitOfMeasurementChangedHandler($event) {
    this.unitOfMeasurement = $event;
  }

  fillTaxOption() {
    this.applicationDataService
      .getApplicationDataByCategoryId(ApplicationDataEnum.taxOption)
      .subscribe((data) => {
        this.taxOptions = data;
      });
  }

  fillSupplierName() {
    this.contactService.getAllContact().subscribe((data) => {
      this.suppliers = data.filter(
        (x) =>
          x.status === true &&
          x.contactType === 3 &&
          x.categoryId === ApplicationDataEnum.supplier
      );
    });
  }

  fillTaxTypes() {
    this.settingsService.getAllTaxes().subscribe((data) => {
      this.taxTypes = data;
    });
  }

  createProduct() {
    const el = document.getElementById('heading');
    const productUpdate: ProductModel = this.productForm.value;

    if (!this.productForm.invalid) {
      this.blockUI.start();
      this.submitting = true;

      if (this.image.selectedFile) {
        productUpdate.productLogo = this.image.selectedFile.src
          .replace('data:', '')
          .replace(/^.+,/, '');
      }

      const locations: ProductLocationModel[] = [];
      productUpdate.locationName.forEach((l) => {
        const model = new ProductLocationModel();
        model.locationId = l.id;
        model.productId = this.itemid;
        locations.push(model);
      });

      productUpdate.productLocation = locations;
      productUpdate.supplierId = productUpdate.supplierId;
      productUpdate.taxTypeId = productUpdate.taxTypeId;
      productUpdate.costPrice = Number(productUpdate.costPrice);
      productUpdate.currentStock = Number(productUpdate.currentStock);
      productUpdate.minimumStock = Number(productUpdate.minimumStock);
      productUpdate.salePrice = Number(productUpdate.salePrice);
      productUpdate.unitOfMeasurement = this.unitOfMeasurement;

      if (this.taxOptionHide === true && productUpdate.taxOptionId === 0) {
        this.displayErrorMessage(
          'Error occurred while adding product, please try again.'
        );
        this.blockUI.stop();
        el.scrollIntoView();
        this.submitting = false;
        return;
      }

      if (this.addItem) {
        this.offeringsService.createProduct(productUpdate).subscribe(
          (data) => {
            this.submitting = false;
            this.displaySuccessMessage('Product added successfully.');
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          (error) => {
            this.displayErrorMessage(
              'Error occurred while adding Product, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      } else {
        productUpdate.id = this.itemid;
        this.offeringsService.updateProduct(productUpdate).subscribe(
          (data) => {
            this.submitting = false;
            this.displaySuccessMessage('Product updated successfully.');
            this.cancel();
            el.scrollIntoView();
            this.blockUI.stop();
          },
          (error) => {
            this.displayErrorMessage(
              'Error occurred while updating Product, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
      }
    }
  }

  handleSupplierFilter(value) {
    this.suppliers = this.suppliers.filter(
      (s) => s.categoryName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.supplierFilter = value;
  }

  handleSupplierChange(value) {
    this.suppliers = value;
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

  handleTaxTypeChange(e) {
    const tt = this.taxTypes.filter((x) => x.id === e);
    if (tt[0].taxType.toLowerCase() === 'no tax') {
      this.taxOptionHide = false;
      this.productForm.get('taxOptionId').patchValue(0);
    } else {
      this.taxOptionHide = true;
    }
  }

  parentProductCallBack(e) {
    this.fillSupplierName();
    this.productForm.get('supplierId').patchValue(e);
  }
}
