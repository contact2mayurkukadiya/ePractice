import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationDataModel } from 'src/app/models/app.misc';
import { ApplicationDataService } from 'src/app/services/app.applicationdata.service';

@Component({
  selector: 'app-add-new-dropdown',
  templateUrl: './add-new-dropdown.component.html',
  styleUrls: ['./add-new-dropdown.component.css'],
})
export class AddNewDropdownComponent implements OnInit {
  appData: ApplicationDataModel[];
  appFilterData: ApplicationDataModel[];
  public filter: string;
  @Input() categoryId: number;
  @Input() selectedId: number;
  @Output() appId: EventEmitter<number> = new EventEmitter<number>();

  constructor(public applicationDataService: ApplicationDataService) {}

  ngOnInit() {
    this.applicationDataService
      .getApplicationDataByCategoryId(this.categoryId)
      .subscribe((data) => {
        this.appData = this.appFilterData = data;
      });
  }

  handleFilter(value) {
    this.appFilterData = this.appData.filter(
      (s) => s.categoryName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.filter = value;
  }

  handleChange(id) {
    this.appId.emit(id);
  }

  public addNew(): void {
    this.applicationDataService
      .createApplicationData(
        new ApplicationDataModel(0, this.filter, this.categoryId, true)
      )
      .subscribe((id) => {
        this.appData.push(
          new ApplicationDataModel(id, this.filter, this.categoryId, true)
        );
        this.handleFilter(this.filter);
      });
  }
}
