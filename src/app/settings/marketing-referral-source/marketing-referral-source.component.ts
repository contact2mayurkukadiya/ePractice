import { Component, OnInit, Input } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';
import { SettingsService } from 'src/app/services/app.settings.service';

@Component({
  selector: 'app-marketing-referral-source',
  templateUrl: './marketing-referral-source.component.html',
  styleUrls: ['./marketing-referral-source.component.css']
})
export class MarketingReferralSourceComponent extends BaseGridComponent implements OnInit {
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

    this.settingService.getAllMarketingSources().subscribe(data => {
      data.forEach(d => {
        d.locationName = d.isAllowAllLocation ? "All Locations" : d.marketingSourceLocation.map(l => l.locationName).join(",");
      });
      this.gridData = data;
      this.loadItems();
    });
  }

}
