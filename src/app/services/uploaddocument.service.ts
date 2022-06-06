import { Injectable } from '@angular/core';
import { DocumentListModel } from '../models/app.patient.model';
import { BaseService } from './app.base.service';

@Injectable()
export class UploaddocumentService extends BaseService {

  getAllDocuments() {
    return this.http.get<any[]>(this.environmentSettings.apiBaseUrl + `/getallcontacts`);
  }

  // getContactById(contactId: string) {
  //   return this.http.get<DocumentListModel>(this.environmentSettings.apiBaseUrl + `/getcontactbyid?contactId=${contactId}`);
  // }

  // createContact(contactModel: DocumentListModel) {
  //   return this.http.post<any>(this.environmentSettings.apiBaseUrl + '/createcontact', contactModel);
  // }

  // updateContact(contactModel: DocumentListModel) {
  //   return this.http.post<any>(this.environmentSettings.apiBaseUrl + '/updatecontact', contactModel);
  // }
}
