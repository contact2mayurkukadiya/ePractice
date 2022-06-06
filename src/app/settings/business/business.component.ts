import { Component, OnInit } from '@angular/core';
import { BusinessModel } from 'src/app/models/app.business.model';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})



export class BusinessComponent implements OnInit {

  dataSource: BusinessModel[];
  
  // = [
  //   {
  //     id: "1",
  //     businessName: "ABC TEST",
  //     businessHours: "9AM-5PM",
  //     calendarColor: "#fff",
  //     contactPerson: "Malcolm Tim",
  //     defaultBusiness: true,
  //     status: "Active",
  //     timeZone: "AEST + 5"
  //   }
  // ];

  displayedColumns: string[] = ["id" , "businessName", "businessHours", "timeZone", "contactPerson", "calendarColor", "defaultBusiness", "status"];


  constructor(private businessService: BusinessService,
              private appState: AppState      
    ) { }

  ngOnInit() {
    this.businessService.getAllBusiness().subscribe(business => {
      this.dataSource = business;

    });

    this.businessService.getParentBusiness(this.appState.UserProfile.parentBusinessId).subscribe(data => {
    });
  }

}
