import { Component, OnInit, Input } from '@angular/core';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';

@Component({
  selector: 'app-treatment-room',
  templateUrl: './treatment-room.component.html',
  styleUrls: ['./treatment-room.component.css']
})
export class TreatmentRoomComponent extends BaseGridComponent implements OnInit {
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
    
    this.settingService.getAllTreatmentRooms().subscribe(data => {
      data.forEach(d => {
        d.locationName = d.isAllowAllLocation ? "All Locations" : d.treatmentLocation.map(l => l.locationName).join(",");
      });
      this.gridData = data;
      this.loadItems();
    });
  }
}
