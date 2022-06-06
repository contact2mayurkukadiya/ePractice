import { Component, OnInit, Input } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';
import { SettingsService } from 'src/app/services/app.settings.service';

@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.css']
})
export class PaymentTypeComponent extends BaseGridComponent implements OnInit {
  @Input() data: boolean;

  constructor(private settingService: SettingsService) { 
    super();
  }

  ngOnInit() {
    if(this.data == true) {
      this.setActiveFilter();
    }
    else {
      this.setInactiveFilter();
    }

    this.settingService.getAllPaymentTypes().subscribe(data => {
      data.forEach(d => {
        d.locationName = d.isAllowAllLocation ? "All Locations" : d.paymentLocation.map(l => l.locationName).join(",");
      });
      this.gridData = data;
      this.loadItems();
    });
  }
}
