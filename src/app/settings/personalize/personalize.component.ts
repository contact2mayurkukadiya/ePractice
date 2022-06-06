import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-personalize',
  templateUrl: './personalize.component.html',
  styleUrls: ['./personalize.component.css'],
})
export class PersonalizeComponent extends BaseItemComponent implements OnInit {
  personalizeTabs: Array<any> = [
    {
      active: false,
      title: 'Patient ID',
      type: 'patient',
    },
    {
      active: false,
      title: 'Invoice ID',
      type: 'invoice',
    },
    {
      active: false,
      title: 'Payment ID',
      type: 'payment',
    },
  ];
  patientVisible: boolean;
  invoiceVisible: boolean;
  paymentVisible: boolean;

  constructor(public location: Location, private _route: ActivatedRoute) {
    super(location);
  }

  ngOnInit() {
    this.patientVisible = true;
    this._route.params.subscribe((params) => {
      if (params.option) {
        const selectedTab = this.personalizeTabs.find(
          (x) => x.type === params.option
        );
        if (selectedTab !== undefined) {
          this.clickPersonalizeTabs(selectedTab);
        }
      }
    });
  }

  clickPersonalizeTabs(tab) {
    this.disableDefault();
    const ptabs = [];
    this.personalizeTabs.forEach((x) => {
      if (x.title === tab.title) {
        x.active = true;
      } else {
        x.active = false;
      }
      ptabs.push(x);
    });

    this.personalizeTabs = ptabs;

    if (tab.title === 'Patient ID') {
      this.patientVisible = true;
    } else if (tab.title === 'Invoice ID') {
      this.invoiceVisible = true;
    } else if (tab.title === 'Payment ID') {
      this.paymentVisible = true;
    }
  }

  disableDefault() {
    this.patientVisible = false;
    this.invoiceVisible = false;
    this.paymentVisible = false;
  }
}
