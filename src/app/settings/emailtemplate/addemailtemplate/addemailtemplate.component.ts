import { Component, OnInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppState } from 'src/app/app.state';
import { BusinessService } from 'src/app/services/app.business.service';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ActivatedRoute } from '@angular/router';
import { PatientModel } from 'src/app/models/app.patient.model';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BusinessTemplateLocations, BusinessTemplateModel } from 'src/app/models/app.settings.model';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import {
  LocationModel
} from 'src/app/models/app.treatmentnotes.model';
@Component({
  selector: 'app-addemailtemplate',
  templateUrl: './addemailtemplate.component.html',
  styleUrls: ['./addemailtemplate.component.css']
})
export class AddemailtemplateComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  patients: PatientModel;
  pokemonControl = new FormControl();
  public expanded = false;
  public liked = false;
  public btnText = 'More';
  isLoading: boolean = true;
  duplicateform: string;
  public toggleRecipe(): void {
    this.expanded = !this.expanded;
    this.btnText = this.expanded ? 'Less' : 'More';
    this.heartIcon();
  }
  public heartIcon(): string {
    return this.liked ? 'k-icon k-i-arrow-60-up' : 'k-icon k-i-arrow-60-down';
  }
  public toggleLike(): void {
    this.liked = !this.liked;
  }

  public data: any[] = [
    {
      id: 2, text: 'Business Details', items: [
        { id: 3, text: 'Business Name', class: '#' },
        { id: 4, text: 'Contact Person', class: '#' },
        { id: 5, text: 'Address 1', class: '#' },
        { id: 6, text: 'Address 2', class: '#' },
        { id: 7, text: 'country', class: '#' },
        { id: 8, text: 'state', class: '#' },
        { id: 9, text: 'city', class: '#' },
        { id: 10, text: 'Post code', class: '#' },
        { id: 11, text: 'Phone', class: '#' },
        { id: 12, text: 'Mobile', class: '#' },
        { id: 13, text: 'Fax', class: '#' },
        { id: 14, text: 'Email', class: '#' },
        { id: 15, text: 'Website', class: '#' },
        { id: 16, text: 'Bank Name', class: '#' },
        { id: 17, text: 'BSB No', class: '#' },
        { id: 18, text: 'Account No', class: '#' },
        { id: 19, text: 'Account Name', class: '#' },
      ]
    },
    {
      id: 20, text: 'Location Details', items: [
        { id: 21, text: 'Location  Name', class: '#' },
        { id: 22, text: 'Contact Person', class: '#' },
        { id: 23, text: 'Address 1', class: '#' },
        { id: 24, text: 'Address 2', class: '#' },
        { id: 25, text: 'country', class: '#' },
        { id: 26, text: 'state', class: '#' },
        { id: 27, text: 'city', class: '#' },
        { id: 28, text: 'Post code', class: '#' },
        { id: 29, text: 'Phone', class: '#' },
        { id: 30, text: 'Mobile', class: '#' },
        { id: 31, text: 'Fax', class: '#' },
        { id: 32, text: 'Email', class: '#' },
        { id: 33, text: 'Website', class: '#' },
      ]
    },
    {
      id: 34, text: 'Patient Details', items: [
        { id: 35, text: 'Patient ID', class: '#' },
        { id: 36, text: 'Title', class: '#' },
        { id: 37, text: 'Full Name', class: '#' },
        { id: 38, text: 'Fname', class: '#' },
        { id: 39, text: 'Lname', class: '#' },
        { id: 40, text: 'Gender', class: '#' },
        { id: 41, text: 'DOB', class: '#' },
        { id: 42, text: 'Age', class: '#' },
        { id: 43, text: 'First Visit DAte', class: '#' },
        { id: 44, text: 'Primary Practitioner', class: '#' },
        { id: 45, text: 'Address', class: '#' },
        { id: 46, text: 'country', class: '#' },
        { id: 47, text: 'State', class: '#' },
        { id: 48, text: 'city', class: '#' },
        { id: 49, text: 'Post code', class: '#' },
        { id: 50, text: 'Home Ph', class: '#' },
        { id: 51, text: 'Work Ph', class: '#' },
        { id: 52, text: 'Mobile', class: '#' },
        { id: 53, text: 'Email', class: '#' },
        {
          id: 54, text: 'Employer Details', items: [
            { id: 55, text: 'Occupation', class: '#' },
            { id: 56, text: 'Employer', class: '#' },
            { id: 57, text: 'Contact Person', class: '#' },
            { id: 58, text: 'Work Phone', class: '#' },
            { id: 59, text: 'eMail', class: '#' }
          ]
        },
        {
          id: 60, text: 'Billing', items: [
            { id: 61, text: 'Invoice Notes', class: '#' }
          ]
        },
        {
          id: 62, text: 'Health Fund', items: [
            { id: 63, text: 'HL', class: '#' },
            { id: 64, text: 'HL Medicare Membership No', class: '#' },
            { id: 65, text: 'HL Medicare IRN', class: '#' },
            { id: 66, text: 'HL DVA Membership No', class: '#' },
            { id: 67, text: 'HL L DVA IRN,', class: '#' }
          ]
        }
      ]
    },
    {
      id: 68, text: 'Case', items: [
        { id: 69, text: 'Case Name', class: '#' },
      ]
    },
    {
      id: 70, text: 'Appointment Details', items: [
        { id: 71, text: 'Show DAte and Time', class: '#' },
        { id: 72, text: 'Patient First Appt Date Time', class: '#' },
        { id: 73, text: 'Patient Last Appt', class: '#' },
        { id: 74, text: 'Patient Current Appt', class: '#' },
        { id: 75, text: 'Patient Next Appt', class: '#' },
        { id: 76, text: 'Patient All Past Appointments', class: '#' },
        { id: 77, text: 'Patient All Suture Appointments', class: '#' },
      ]
    },
    {
      id: 78, text: 'Practitioner Details', items: [
        { id: 79, text: 'Title', class: '#' },
        { id: 80, text: 'First Name', class: '#' },
        { id: 81, text: 'Last Name', class: '#' },
        { id: 82, text: 'Name (Fname + LName)', class: '#' },
        { id: 83, text: 'qualification', class: '#' },
        { id: 84, text: 'position', class: '#' },
        { id: 85, text: 'Phone', class: '#' },
        { id: 86, text: 'Mobile', class: '#' },
        { id: 87, text: 'Email', class: '#' },
        { id: 88, text: 'Signature', class: '#' },
        { id: 89, text: 'speciality', class: '#' },
        { id: 90, text: 'Provider No', class: '#' },
        { id: 91, text: 'Notes', class: '#' },
        { id: 92, text: 'Patient First Appt Practitioner', class: '#' },
        { id: 93, text: 'Patient Last Appt Practitioner', class: '#' },
        { id: 94, text: 'Patient Current Appt Practitioner', class: '#' },
        { id: 95, text: 'Patient Next Appt Practitioner', class: '#' }

      ]
    },
    {
      id: 96, text: 'Referral Details', items: [
        { id: 97, text: 'Organization Name', class: '#' },
        { id: 98, text: 'Title', class: '#' },
        { id: 99, text: 'First Name', class: '#' },
        { id: 100, text: 'Last Name', class: '#' },
        { id: 101, text: 'Name (Fname + LName)', class: '#' },
        { id: 102, text: 'speciality', class: '#' },
        { id: 103, text: 'Provider No', class: '#' },
        { id: 104, text: 'Phone', class: '#' },
        { id: 105, text: 'Mobile', class: '#' },
        { id: 106, text: 'FAX', class: '#' },
        { id: 107, text: 'Email', class: '#' },
        { id: 108, text: 'Notes', class: '#' },
        { id: 109, text: 'start Date', class: '#' },
        { id: 110, text: 'End Date', class: '#' },
        { id: 111, text: 'Appointment Count', class: '#' },
        { id: 112, text: 'Referral Notes', class: '#' }

      ]
    },
    {
      id: 113, text: 'Third Party Details', items: [
        { id: 114, text: 'Organization Name', class: '#' },
        { id: 115, text: ' Department Name', class: '#' },
        { id: 116, text: 'Title', class: '#' },
        { id: 117, text: 'First Name', class: '#' },
        { id: 118, text: 'Last Name', class: '#' },
        { id: 119, text: 'Name (Fname + LName)', class: '#' },
        { id: 120, text: 'Reference No', class: '#' },
        { id: 121, text: 'Phone', class: '#' },
        { id: 122, text: 'Mobile', class: '#' },
        { id: 123, text: 'FAX', class: '#' },
        { id: 124, text: 'Email', class: '#' },
        { id: 125, text: 'Notes', class: '#' },
        { id: 126, text: 'start Date', class: '#' },
        { id: 127, text: 'End Date', class: '#' },
        { id: 128, text: 'Appointment Count', class: '#' }

      ]
    },
    {
      id: 129, text: 'Invoice Details', items: [
        { id: 130, text: 'Invoice No', class: '#' },
        { id: 131, text: 'Date', class: '#' },
        { id: 132, text: 'Invoice Amt', class: '#' },
        { id: 133, text: 'GST', class: '#' },
        { id: 134, text: 'Total', class: '#' },
        { id: 135, text: 'Paid', class: '#' },
        { id: 136, text: 'Balance', class: '#' }

      ]
    },
    {
      id: 137, text: 'Misc', items: [
        { id: 138, text: 'Today’s Date', class: '#' },
        { id: 139, text: 'Current Time', class: '#' },
        { id: 140, text: 'He \ She', class: '#' },
        { id: 141, text: ' His or her', class: '#' },

      ]
    }
  ];

  private show: boolean = false;
  private selectedKeys = ['Tags'];
  public onToggle(): void {
    this.show = !this.show;
  }
  public handleSelection({ index }: any): void {
    this.show = false;
  }
  logPan(evt: any) {
    console.log(evt);
  }
  apperance = 'outline';
  addClass = true;
  locationList: any[];
  public opened: boolean = false;
  openedduplicate: boolean = false;
  locationData: LocationModel[] = [];
  bussinesstemplate: BusinessTemplateModel;
  locationMdata: any = [];
  selectedData: any;
  emailForm: FormGroup = new FormGroup({
    name: new FormControl("", Validators.required),
    locationName: new FormControl(""),
    description: new FormControl(""),
    status: new FormControl(true),
    subject: new FormControl("", Validators.required),
    body: new FormControl("", Validators.required),
  });
  constructor(
    private businessService: BusinessService,
    private appState: AppState,
    public location: Location,
    public _route: ActivatedRoute,
    public settingsService: SettingsService,
    private router: Router,
    private render: Renderer2
  ) {
    super(location);
    this.patients = new PatientModel()
    console.log(this.patients)
  }
  locationInterval: any;

  ngOnInit() {
    this.blockUI.start();
    console.log(this.duplicateform);
    this.bussinesstemplate = new BusinessTemplateModel();
    this.businessService
      .getLocationsByBusiness(this.appState.userProfile.parentBusinessId)
      .subscribe((data) => {
        data.map((d) => {
          const m = new LocationModel();
          m.locationId = d.id;
          m.locationName = d.locationName;
          this.locationData.push(m);
        });

        const locationsModel: BusinessTemplateLocations[] = [];
        this.locationData.forEach(
          (l: { locationId: string; locationName: string }) => {
            if (this.appState.selectedUserLocation.id === l.locationId) {
              const m = new BusinessTemplateLocations();
              m.locationId = l.locationId;
              m.locationName = l.locationName;
              locationsModel.push(m);
            }
          }
        );
        this.bussinesstemplate.businessTemplateLocations = locationsModel;
        this.locationMdata = locationsModel;
        console.log(this.locationMdata);
        if (this.locationMdata != '') {
          this.emailForm.get('locationName').setValidators([Validators.required]);
        }
      });

    this._route.params.subscribe(params => {
      if (params.emailTemplateId) {
        this.addItem = false;
        this.itemid = params.emailTemplateId;
        this.settingsService.getallbusinesstemplatesById(this.itemid).subscribe(s => {
          this.emailForm.patchValue(s);
          let locationName = [];
          s.businessTemplateLocations.forEach(sl => {
            locationName.push(this.locationData.find(l => l.locationId == sl.locationId));
          });
          this.emailForm.get("locationName").patchValue(locationName);
          this.bussinesstemplate.businessTemplateLocations = locationName;
        });
      }
    });
    console.log(this.bussinesstemplate.businessTemplateLocations);
    this.blockUI.stop();
  }
  onLocationChange(locationData: any[]) {
    if (locationData.length === 0) {
      this.bussinesstemplate.businessTemplateLocations = [];
    } else {

      const locationsModel: BusinessTemplateLocations[] = [];

      locationData.forEach(
        (l: { locationId: string; locationName: string }) => {
          const m = new BusinessTemplateLocations();
          m.locationId = l.locationId;
          m.locationName = l.locationName;
          locationsModel.push(m);
        }
      );
      this.bussinesstemplate.businessTemplateLocations = locationsModel;
    }
  }
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };
  submitform() {
    let bussinesstemplate: BusinessTemplateModel = this.emailForm.value;
    if (!this.emailForm.invalid) {
      this.blockUI.start();
      this.submitting = true;
      bussinesstemplate.businessTemplateLocations = this.bussinesstemplate.businessTemplateLocations;
      bussinesstemplate.type = 2;
      console.log(bussinesstemplate);
      // return;
      if (this.addItem) {
        this.settingsService.createbusinesstemplate(bussinesstemplate).subscribe(d => {
          this.submitting = false;
          if (this.duplicateform == 'Duplicate') {
            this.settingsService.sharedData = 'Your template has been duplicated successfully';
          }
          else {

            this.settingsService.sharedData = 'Your template has been created successfully';

          }
          this.router.navigate(['/settings/emailtemplate']);
          this.blockUI.stop();
          this.itemid = d;
          this.addItem = false;

        }, error => {
          if (this.duplicateform == 'Duplicate') {
            this.displayErrorMessage("Error occurred while Duplicating template, please try again.");
          }
          else {

            this.displayErrorMessage("Error occurred while adding template, please try again.");

          }
          this.submitting = false;
          this.blockUI.stop();
          console.log(error);
        });
      }
      else {
        bussinesstemplate.id = this.itemid;
        this.settingsService.updatebusinesstemplate(bussinesstemplate).subscribe(d => {
          this.submitting = false;
          this.settingsService.sharedData = 'Your template has been updated successfully';
          this.router.navigate(['/settings/emailtemplate']);
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating template, please try again.");
          this.submitting = false;
          this.blockUI.stop();
        });
      }
    }
  }
  delete() {
    this.opened = true;
  }
  public close(status: string) {
    this.opened = false;
    this.openedduplicate = false;
  }
  duplicate() {
    this.openedduplicate = true;
  }
  confirdelete(status, name) {
    if (name == 'delete') {
      if (status == "yes") {
        this.settingsService
          .deletebusinesstemplatesById(this.itemid)
          .subscribe(
            () => {
              this.settingsService.sharedData = 'Your template has been deleted successfully';
              this.router.navigate(['/settings/emailtemplate/']);
            },
            () => {
              this.displayErrorMessage(
                "Error occurred while deleting Treatment Notes Template, please try again."
              );
            }
          );
      }
    }
    else {
      let bussinesstemplate: BusinessTemplateModel = this.emailForm.value;
      this.emailForm.controls.name.setValue('');
      this.emailForm.controls.description.setValue(bussinesstemplate.description);
      this.emailForm.controls.subject.setValue(bussinesstemplate.subject);
      this.emailForm.controls.body.setValue(bussinesstemplate.body);

      let locations: BusinessTemplateLocations[] = [];
      let locationSelections: LocationGridModel[] = this.emailForm.get("locationName").value;
      if (locationSelections) {
        locationSelections.forEach(l => {
          let m = new BusinessTemplateLocations();
          m.locationId = l.id;
          m.locationName = l.locationName;
          locations.push(m);
        });
      }
      bussinesstemplate.businessTemplateLocations = locations;
      bussinesstemplate.type = 2;
      this.addItem = true;
      this.duplicateform = "Duplicate"
      this.openedduplicate = false;
    }
  }
  allowDrop(ev): void {
    ev.preventDefault();
  }
  drag(ev): void {
    this.selectedData = ev.target.nodeValue
    console.log(ev.target.nodeValue)
    // this.render.addClass(ev.target.nodeValue, "selected");
  }
  drop(ev): void {
    var newValue = this.selectedData;

    ev.target.nodeValue =
      '<span class="dragdata">' + newValue + '</span>';

    console.log(ev.target.nodeValue);
  }
}