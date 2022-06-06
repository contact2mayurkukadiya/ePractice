import { Component, OnInit, Input } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';
import { SettingsService } from 'src/app/services/app.settings.service';

@Component({
  selector: 'app-appointment-type',
  templateUrl: './appointment-type.component.html',
  styleUrls: ['./appointment-type.component.css']
})
export class AppointmentTypeComponent extends BaseGridComponent implements OnInit {
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

    this.settingService.getAllAppointmentTypes().subscribe(data => {
      data.forEach(d => {
        d.locationName = d.isAllowAllLocation ? "All Locations" : d.appointmentTypesLocation.map(l => l.locationName).join(",");
      });
      this.gridData = data;
      this.loadItems();
    });
  }

}
