import { Injectable } from '@angular/core';
import { ApplicationDataModel } from '../models/app.misc';
import { BaseService } from './app.base.service';

@Injectable()
export class ApplicationDataService extends BaseService {
  getAllApplicationData() {
    return this.http.get<ApplicationDataModel[]>(
      this.environmentSettings.apiBaseUrl + '/getallapplicationdata'
    );
  }

  getApplicationDataByCategoryId(categoryId: number) {
    return this.http.get<ApplicationDataModel[]>(
      this.environmentSettings.apiBaseUrl + `/getapplicationdatabycategoryid?categoryId=${categoryId}`
    );
  }

  getApplicationDataById(id: string) {
    return this.http.get<ApplicationDataModel>(
      this.environmentSettings.apiBaseUrl + `/getapplicationdatabyid?applicationDataId=${id}`
    );
  }

  createApplicationData(applicationDataModel: ApplicationDataModel) {
    return this.http
      .post<any>(
        this.environmentSettings.apiBaseUrl + '/createapplicationdata',
        applicationDataModel
      );
  }

  updateApplicationData(applicationDataModel: ApplicationDataModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updateApplicationData',
      applicationDataModel
    );
  }
}
