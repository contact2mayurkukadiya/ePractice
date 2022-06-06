import { Component, OnInit } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';
import { StaffService } from 'src/app/services/app.staff.service';
import { MatButtonToggleChange } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseGridComponent implements OnInit {

  apperance: string = "outline";

  status: string = "active";
  displaySelection: string = "list";
  staffSelection: string = "All";

  constructor(private staffService: StaffService) {
    super();
  }

  ngOnInit() {
    this.removeFilters();
    this.staffService.getStaffs().subscribe(data => {
      console.log(data);
      this.gridData = data;
      this.loadItems();
    });
  }

  staffActiveChanged(event: MatButtonToggleChange) {
    if (event.value == "active") {
      this.setActiveFilter();
    }
    else {
      this.setInactiveFilter();
    }
    this.loadItems();
  }

  setActive() {
    this.setActiveFilter();
  }

  setInactive() {
    this.setInactiveFilter();
  }
}
