import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AppState } from '../app.state';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BaseGridComponent } from '../shared/base-grid/base-grid.component';
import { ContactService } from '../services/app.contact.service';
import { MatTabChangeEvent, MatButtonToggleChange } from '@angular/material';
import { ContactModel } from '../models/app.contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent extends BaseGridComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  isRoot = false;
  isError = false;
  isLoading = true;
  referralShow = false;
  thirdPartyShow = false;
  generalShow = false;
  public expandCss: string;
  contacts: ContactModel[];
  referralContacts: ContactModel[];
  thirdPartyContacts: ContactModel[];
  generalContacts: ContactModel[];
  contactId = '';
  referralTitle = '';
  referralRouteLink = '';
  referralRouteName = '';
  referralDescription = '';
  thirdPartyTitle = '';
  thirdPartyRouteLink = '';
  thirdPartyRouteName = '';
  thirdPartyDescription = '';
  generalTitle = '';
  generalRouteLink = '';
  generalRouteName = '';
  generalDescription = '';
  sliderType = '';

  public contact: EventEmitter<string> = new EventEmitter();

  constructor(
    public contactService: ContactService,
    public appState: AppState
  ) {
    super();
  }

  ngOnInit() {
    this.removeFilters();
    this.expandCss = 'col-xl-12';
    this.populateLanding();
  }

  populateLanding() {
    this.blockUI.start();
    this.contactService.getAllContact().subscribe((contactData) => {
      this.contacts = contactData;

      this.referralContacts = contactData.filter(
        (x) => x.status === true && x.contactType === 1
      );

      if (this.referralContacts.length === 0) {
        this.referralNoActiveData();
      } else {
        this.referralShow = true;
      }

      this.thirdPartyContacts = contactData.filter(
        (x) => x.status === true && x.contactType === 2
      );

      if (this.thirdPartyContacts.length === 0) {
        this.thirdPartyNoActiveData();
      } else {
        this.thirdPartyShow = true;
      }

      this.generalContacts = contactData.filter(
        (x) => x.status === true && x.contactType === 3
      );

      if (this.generalContacts.length === 0) {
        this.generalNoActiveData();
      } else {
        this.generalShow = true;
      }
    });

    this.isLoading = false;
    this.blockUI.stop();
  }

  private generalNoActiveData() {
    this.generalTitle = 'You haven\'t added a contact';
    this.generalRouteName = 'Add General';
    this.generalDescription =
      'Active - You can create and manage the details of other contacts like Product suppliers, patient\'s employer, Lawyers or solicitors, Laboratories etc.';
    this.generalRouteLink = '/contacts/general/add';
    this.generalShow = false;
  }

  private thirdPartyNoActiveData() {
    this.thirdPartyTitle = 'You haven\'t added a contact';
    this.thirdPartyRouteName = 'Add Third Party';
    this.thirdPartyDescription =
      'Active - You create and can manage the contact details of patient\'s third party payers, which includes Private Insurance Companies and Government Insurance Schemes';
    this.thirdPartyRouteLink = '/contacts/thirdparty/add';
    this.thirdPartyShow = false;
  }

  private referralNoActiveData() {
    this.referralTitle = 'You haven\'t added a contact';
    this.referralRouteName = 'Add Referral';
    this.referralDescription =
      'Active - You can create and manage the contact details of GP or any specialist who refers patients to your Business.';
    this.referralRouteLink = '/contacts/referral/add';
    this.referralShow = false;
  }

  private generalNoInActiveData() {
    this.generalTitle = 'You haven\'t added a contact';
    this.generalRouteName = 'Add General';
    this.generalDescription =
      'InActive - You can create and manage the details of other contacts like Product suppliers, patient\'s employer, Lawyers or solicitors, Laboratories etc.';
    this.generalRouteLink = '/contacts/general/add';
    this.generalShow = false;
  }

  private thirdPartyNoInActiveData() {
    this.thirdPartyTitle = 'You haven\'t added a contact';
    this.thirdPartyRouteName = 'Add Third Party';
    this.thirdPartyDescription =
      'InActive - You create and can manage the contact details of patient\'s third party payers, which includes Private Insurance Companies and Government Insurance Schemes';
    this.thirdPartyRouteLink = '/contacts/thirdparty/add';
    this.thirdPartyShow = false;
  }

  private referralNoInActiveData() {
    this.referralTitle = 'You haven\'t added a contact';
    this.referralRouteName = 'Add Referral';
    this.referralDescription =
      'InActive - You can create and manage the contact details of GP or any specialist who refers patients to your Business.';
    this.referralRouteLink = '/contacts/referral/add';
    this.referralShow = false;
  }

  referralActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.referralContacts = this.contacts.filter(
        (x) => x.status === true && x.contactType === 1
      );

      if (this.referralContacts.length === 0) {
        this.referralNoActiveData();
      } else {
        this.referralShow = true;
        this.referralTitle = '';
      }
    } else {
      this.referralContacts = this.contacts.filter(
        (x) => x.status === false && x.contactType === 1
      );

      if (this.referralContacts.length === 0) {
        this.referralNoInActiveData();
      } else {
        this.referralShow = true;
        this.referralTitle = '';
      }
    }
  }

  thirdPartyActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.thirdPartyContacts = this.contacts.filter(
        (x) => x.status === true && x.contactType === 2
      );

      if (this.thirdPartyContacts.length === 0) {
        this.thirdPartyNoActiveData();
      } else {
        this.thirdPartyShow = true;
        this.thirdPartyTitle = '';
      }
    } else {
      this.thirdPartyContacts = this.contacts.filter(
        (x) => x.status === false && x.contactType === 2
      );

      if (this.thirdPartyContacts.length === 0) {
        this.thirdPartyNoInActiveData();
      } else {
        this.thirdPartyShow = true;
        this.thirdPartyTitle = '';
      }
    }
  }

  generalActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.generalContacts = this.contacts.filter(
        (x) => x.status === true && x.contactType === 3
      );

      if (this.generalContacts.length === 0) {
        this.generalNoActiveData();
      } else {
        this.generalShow = true;
        this.generalTitle = '';
      }
    } else {
      this.generalContacts = this.contacts.filter(
        (x) => x.status === false && x.contactType === 3
      );

      if (this.generalContacts.length === 0) {
        this.generalNoInActiveData();
      } else {
        this.generalShow = true;
        this.generalTitle = '';
      }
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.appState.selectedTabState.next(tabChangeEvent.index);
  }
}
