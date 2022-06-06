import { Injectable } from '@angular/core';
import { ContactModel } from '../models/app.contact.model';
import { BaseService } from './app.base.service';

@Injectable()
export class ContactService extends BaseService {
  getAllContact() {
    return this.http.get<any[]>(this.environmentSettings.apiBaseUrl + `/getallcontacts`);
  }

  getContactById(contactId: string) {
    return this.http.get<ContactModel>(this.environmentSettings.apiBaseUrl + `/getcontactbyid?contactId=${contactId}` );
  }

  createContact(contactModel: ContactModel) {
    return this.http.post<any>(this.environmentSettings.apiBaseUrl + '/createcontact', contactModel);
  }

  updateContact(contactModel: ContactModel) {
    return this.http.post<any>(this.environmentSettings.apiBaseUrl + '/updatecontact', contactModel);
  }
}
