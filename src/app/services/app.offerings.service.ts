import { Injectable } from '@angular/core';
import { ClassModel } from '../models/app.class.model';
import { ServiceModel } from '../models/app.service.model';
import { ProductModel } from '../models/app.product.model';
import { BaseService } from './app.base.service';

@Injectable()
export class OfferingsService extends BaseService {
  getAllProducts() {
    return this.http.get<any[]>(
      this.environmentSettings.apiBaseUrl + '/getallproducts'
    );
  }

  getProductById(productId: string) {
    return this.http.get<ProductModel>(
      this.environmentSettings.apiBaseUrl +
        `/getproductbyid?productId=${productId}`
    );
  }

  createProduct(product: ProductModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/createproduct',
      product
    );
  }

  updateProduct(product: ProductModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updateproduct',
      product
    );
  }

  getAllClasses() {
    return this.http.get<any[]>(
      this.environmentSettings.apiBaseUrl + '/getallclasses'
    );
  }

  getClassById(classId: string) {
    return this.http.get<ClassModel>(
      this.environmentSettings.apiBaseUrl + `/getclassbyid?classId=${classId}`
    );
  }

  createClass(classModel: ClassModel) {
    //const resp = JSON.stringify(classModel);
    //console.log(resp);
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/createclass',
      classModel
    );
  }

  updateClass(classModel: ClassModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updateclass',
      classModel
    );
  }

  getAllService() {
    return this.http.get<any[]>(
      this.environmentSettings.apiBaseUrl + '/getallservicees'
    );
  }

  getServiceById(serviceId: string) {
    return this.http.get<ServiceModel>(
      this.environmentSettings.apiBaseUrl +
        `/getservicebyid?serviceId=${serviceId}`
    );
  }

  createService(serviceModel: ServiceModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/createservice',
      serviceModel
    );
  }

  updateService(serviceModel: ServiceModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updateservice',
      serviceModel
    );
  }
}
