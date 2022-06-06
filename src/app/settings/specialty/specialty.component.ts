import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BaseGridComponent } from '../../shared/base-grid/base-grid.component';

@Component({
  selector: 'app-specialty',
  templateUrl: './specialty.component.html',
  styleUrls: ['./specialty.component.css']
})
export class SpecialtyComponent extends BaseGridComponent implements OnInit {
  @Input() data: boolean;

  constructor(private settingService: SettingsService,
              public appState: AppState) { 
    super();
  }

  ngOnInit() {
    this.permission = this.appState.getSubModulePermission("Tools", "Specialisation");

    if(this.data == true) {
      this.setActiveFilter();
    }
    else {
      this.setInactiveFilter();
    }
    
    this.settingService.getAllSpecialties().subscribe(data => {
      data.forEach(d => {
        d.locationName = d.isAllowAllLocation ? "All Locations" : d.specialtyLocation.map(l => l.locationName).join(",");
      });
      this.gridData = data;
      this.loadItems();
    });
  }
}
