import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent extends BaseGridComponent implements OnInit {
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

    this.settingService.getAllTaxes().subscribe(data => {
      data.forEach(d => {
        d.locationName = d.isAllowAllLocation ? "All Locations" : d.taxLocation.map(l => l.locationName).join(",");
      });
      this.gridData = data;
      this.loadItems();
    });
  }
}
