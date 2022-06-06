import { Component, OnInit } from '@angular/core';
import { AppState } from '../app.state';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BaseGridComponent } from '../shared/base-grid/base-grid.component';
import { OfferingsService } from '../services/app.offerings.service';
import { MatTabChangeEvent, MatButtonToggleChange } from '@angular/material';
import { ProductModel } from '../models/app.product.model';
import { ClassModel } from '../models/app.class.model';
import { ServiceModel } from '../models/app.service.model';

@Component({
  selector: 'app-offerings',
  templateUrl: './offerings.component.html',
  styleUrls: ['./offerings.component.css'],
})
export class OfferingsComponent extends BaseGridComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  products: ProductModel[];
  productAll: any[] = [];
  classes: ClassModel[];
  classesAll: any[] = [];
  service: ServiceModel[];
  serviceAll: any[] = [];
  isRoot = false;
  isError = false;
  isLoading = true;
  detailViewProductShow = false;
  listViewProductShow = false;
  detailViewClassShow = false;
  listViewClassShow = false;
  detailViewServiceShow = false;
  listViewServiceShow = false;

  serviceTitle = '';
  serviceRouteLink = '';
  serviceRouteName = '';
  serviceDescription = '';
  classTitle = '';
  classRouteLink = '';
  classRouteName = '';
  classDescription = '';
  productTitle = '';
  productRouteLink = '';
  productRouteName = '';
  productDescription = '';

  constructor(
    public offeringsService: OfferingsService,
    public appState: AppState
  ) {
    super();
  }

  ngOnInit() {
    this.removeFilters();
    this.populateLanding();
  }

  populateLanding() {
    this.blockUI.start();

    this.offeringsService.getAllProducts().subscribe((data) => {
      this.productAll = [];
      if (data.length === 0) {
        this.productTitle = 'You haven\'t added a product';
        this.productRouteLink = '/offerings/products/add';
        this.productRouteName = 'Add Products';
        this.productDescription =
          'Health products are important for addressing health problems and improve quality of lives. They form an indispensable component of health systems in the prevention, diagnosis and treatment of disease and in alleviating disability and functional deficiency.';
        this.detailViewProductShow = false;
        this.listViewProductShow = false;
      } else {
        this.detailViewProductShow = true;
        this.listViewProductShow = false;
      }
      data.forEach((d) => {
        if (d.productLogo) {
          d.productLogo = `data:image/jpg;base64,${d.productLogo}`;
        }
        this.productAll.push(d);
      });
      this.products = data.filter((x) => x.status === true);
    });

    this.offeringsService.getAllClasses().subscribe((data) => {
      this.classesAll = [];
      if (data.length === 0) {
        this.classTitle = 'You haven\'t added a class';
        this.classRouteLink = '/offerings/classes/add';
        this.classRouteName = 'Add Classes';
        this.classDescription =
          'classes are the assistance that your business offer and provide to your customers';
        this.detailViewClassShow = false;
        this.listViewClassShow = false;
      } else {
        this.detailViewClassShow = true;
        this.listViewClassShow = false;
      }
      data.forEach((d) => {
        if (d.classLogo) {
          d.classLogo = `data:image/jpg;base64,${d.classLogo}`;
        }
        this.classesAll.push(d);
      });
      this.classes = data.filter((x) => x.status === true);
    });

    this.offeringsService.getAllService().subscribe((data) => {
      this.serviceAll = [];
      if (data.length === 0) {
        this.serviceTitle = 'You haven\'t added a service';
        this.serviceRouteLink = '/offerings/service/add';
        this.serviceRouteName = 'Add Service';
        this.serviceDescription =
          'Services are the assistance that your business offer and provide to your customers';
        this.detailViewServiceShow = false;
        this.listViewServiceShow = false;
      } else {
        this.detailViewServiceShow = true;
        this.listViewServiceShow = false;
      }
      data.forEach((d) => {
        if (d.serviceLogo) {
          d.serviceLogo = `data:image/jpg;base64,${d.serviceLogo}`;
        }
        this.serviceAll.push(d);
      });
      this.service = data.filter((x) => x.status === true);
    });

    this.isLoading = false;
    this.blockUI.stop();
  }

  productActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.products = this.productAll.filter((x) => x.status === true);
    } else {
      this.products = this.productAll.filter((x) => x.status === false);
    }
  }

  productViewChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.detailViewProductShow = true;
      this.listViewProductShow = false;
    } else {
      this.detailViewProductShow = false;
      this.listViewProductShow = true;
    }
  }

  classActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.classes = this.classesAll.filter((x) => x.status === true);
    } else {
      this.classes = this.classesAll.filter((x) => x.status === false);
    }
  }

  classViewChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.detailViewClassShow = true;
      this.listViewClassShow = false;
    } else {
      this.detailViewClassShow = false;
      this.listViewClassShow = true;
    }
  }

  serviceActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.service = this.serviceAll.filter((x) => x.status === true);
    } else {
      this.service = this.serviceAll.filter((x) => x.status === false);
    }
  }

  serviceViewChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.detailViewServiceShow = true;
      this.listViewServiceShow = false;
    } else {
      this.detailViewServiceShow = false;
      this.listViewServiceShow = true;
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedTabState.next(tabChangeEvent.index);
  }
}
