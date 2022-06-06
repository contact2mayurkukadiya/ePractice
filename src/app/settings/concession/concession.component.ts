import { Component, OnInit, Input } from '@angular/core';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';

@Component({
  selector: 'app-concession',
  templateUrl: './concession.component.html',
  styleUrls: ['./concession.component.css']
})
export class ConcessionComponent extends BaseGridComponent implements OnInit {
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

    this.settingService.getAllConcessions().subscribe(data => {
      data.forEach(d => {
        d.locationName = d.isAllowAllLocation ? "All Locations" : d.concessionLocation.map(l => l.locationName).join(",");
      });
      this.gridData = data;
      this.loadItems();
    });
  }
}
