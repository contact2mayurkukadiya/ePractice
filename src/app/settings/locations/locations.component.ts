import { Component, OnInit, Input } from '@angular/core';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent extends BaseGridComponent implements OnInit {
  @Input() data: boolean;

  constructor(private businessService: BusinessService, 
              public appState: AppState
    ) {
    super();
  }

  ngOnInit() {
    this.permission = this.appState.getSubModulePermission("Tools", "Business Information");

    if(this.data == true) {
      this.setActiveFilter();
    }
    else {
      this.setInactiveFilter();
    }

    this.businessService.getLocationsByBusiness(this.appState.UserProfile.parentBusinessId).subscribe(data => {
      data.forEach(d => {
        d.timeString = "";
        if(d.startTime && d.endTime) {
          let start = new Date(d.startTime);
          let end = new Date(d.endTime);
          let startString = start.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
          let endString = end.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
          d.timeString = `${startString} to ${endString}`;
          d.isStatus = d.status;
        }
      });
      
      this.gridData = data;
      this.loadItems();
    });
  }
}
