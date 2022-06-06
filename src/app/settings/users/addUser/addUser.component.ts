import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MatSelectChange, MatDialog } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dt-format';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/services/app.settings.service';
import { LocationGridModel } from 'src/app/models/app.location.model';
import { PractitionerDetailsOptionsComponent } from '../practitioner-details-options/practitioner-details-options.component';
import { RoleService } from 'src/app/services/app.role.service';
import { map } from 'rxjs/operators';
import { RoleModel } from 'src/app/models/app.role.model';
import { UserLocationRoleModel, UserLocationRolesPractitonerModel, StaffModel, PractitionerModel, PractitionerLocationModel } from 'src/app/models/app.staff.model';
import { SpecialtyModel } from 'src/app/models/app.settings.model';
import { MiscService } from 'src/app/services/app.misc.service';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { StaffService } from 'src/app/services/app.staff.service';
import { ImageSnippet } from 'src/app/models/app.misc';

@Component({
  selector: 'app-add-user',
  templateUrl: './addUser.component.html',
  styleUrls: ['./addUser.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class AddUserComponent extends BaseItemComponent implements OnInit {
  @ViewChild("photo", { static: true }) photo : ImageUploadComponent;
  @ViewChild("signature", { static: true }) signature : ImageUploadComponent;

  apperance: string = "outline";
  color: any;
  addUser: boolean = true;
  countries: any[];
  
  clickedPractitionerOptions: boolean = false;
  hasPractitionerRole: boolean = false;

  roleLocations: RoleLocation[] = [];
  specialties: SpecialtyModel[];
  practitioners: any[];

  userForm: FormGroup = new FormGroup({
    title: new FormControl(""),
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    middleName: new FormControl(""),
    nickName: new FormControl(""),
    position: new FormControl("", Validators.required),
    emailId: new FormControl("", [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]),
    qualifications: new FormControl(""),
    phone: new FormControl("", Validators.pattern("^[0-9]*$")),
    mobile: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    address: new FormControl(""),
    country: new FormControl("Australia"),
    state: new FormControl(""),
    city: new FormControl(""),
    photo: new FormControl(""),
    postCode: new FormControl(""),
    dob: new FormControl(null),
    gender: new FormControl(""),
    signature: new FormControl(""),
    emailSignature: new FormControl(""),
    biography: new FormControl(""),
    notes: new FormControl(""),
    isStatus: new FormControl(true),
    isTermOfServicee: new FormControl(false),
    isTreatmentPrivateNote: new FormControl(false),
    isTreatmentSharedNote: new FormControl(false),
    isPractitionerCalendar: new FormControl(false),
    isDoubleBooking: new FormControl(false),
    isPatientOnlineBooking: new FormControl(false),
    isCancelledAppointment: new FormControl(false),
    isOnlineBooking: new FormControl(false),
    isAccess: new FormControl(true),  
    // calendar: new FormControl(""),
    // calendarColumn: new FormControl(false),
    practitionerCalendarColor: new FormControl("#ffffff"),
    treatmentNotesPrivacy: new FormControl("")
  });

  constructor(public businessService: BusinessService,
    public appState: AppState,
    public location: Location,
    public _route: ActivatedRoute,
    public dialog: MatDialog,
    public settingService: SettingsService,
    public roleService: RoleService,
    private miscService: MiscService,
    private staffService: StaffService) { 
     super(location);

  }

  roles: Array<RoleModel> = [];
  locationInterval: any;

  ngOnInit() {
    this.populateOptions();
    this._route.params.subscribe(params => {
      if(params.staffId) {
        this.addItem = false;
        this.itemid = params.staffId;
        this.staffService.getStaffById(this.itemid).subscribe(data => {
          if(data.photo) {
            this.photo.selectedFile = new ImageSnippet(`data:image/jpeg;base64,${data.photo}`, null); 
          }
          if(data.signature) {
            this.signature.selectedFile = new ImageSnippet(`data:image/jpeg;base64,${data.signature}`, null); 
          }
          
          this.userForm.patchValue(data);

          let treatmentNotesPrivacy: string = data.isTreatmentPrivateNote ? "Private Notes" : "Shared Notes";
          this.userForm.get('treatmentNotesPrivacy').setValue(treatmentNotesPrivacy);

          this.locationInterval = setInterval(() => {
            if(this.locationList) {
              this.loadRoleLocations(data);
              clearInterval(this.locationInterval);
            }
          }, 200);
        });
      }
      else {
        this.locationInterval = setInterval(() => {
          if(this.appState.selectedUserLocation) {
            let rl:RoleLocation = new RoleLocation();
            rl.location = this.appState.selectedUserLocation;
            rl.role = null;
            rl.options = [];
            rl.practitioners = [];
            this.roleLocations.push(rl);
            clearInterval(this.locationInterval);
          }
        }, 200);
      }
    });
  }

  loadRoleLocations(data: StaffModel) {
    if(data.userLocationRoles && data.userLocationRoles.length > 0) {
      data.userLocationRoles.forEach(ulr => {
        let rm: RoleModel = new RoleModel();
        rm.id = ulr.roleId;
        rm.roleName = ulr.roleName;
        let existing = this.roleLocations.find(rl => rl.location && rl.location.id == ulr.locationId);
        if(existing) {
          existing.role.push(rm);
        }
        else {
          let rl: RoleLocation = new RoleLocation();
          // let locationList = this.getProceededLocationList();
          rl.options = this.locationList;
          rl.location = this.locationList.find(l => l.id == ulr.locationId);
          rl.role = [];
          rl.practitioners = [];
          let rm: RoleModel = new RoleModel();
          rm.id = ulr.roleId;
          rm.roleName = ulr.roleName;
          rl.role.push(rm);
          this.roleLocations.push(rl);
        }
      });
    }

    if(data.userLocationRolesPractitoner && data.userLocationRolesPractitoner.length > 0) {
      this.hasPractitionerRole = true;
      this.clickedPractitionerOptions = true;
      data.userLocationRolesPractitoner.forEach(ulr => {
        
        let roleName = this.roles.find(r => r.id == ulr.roleId).roleName;
        let rm: RoleModel = new RoleModel();
        rm.id = ulr.roleId;
        rm.roleName = roleName;        
        let existing = this.roleLocations.find(rl => rl.location && rl.location.id == ulr.locationId);
        if(existing) {
          existing.hasPractitionerRole = true;
          existing.otherID = ulr.otherID;
          existing.providerNumber = ulr.providerNumber;
          if(!existing.role.find(r => r.id == rm.id)) {
            existing.role.push(rm);
          }
          
          if(!existing.specialties) {
            existing.specialties = [];
          }
          let sp: SpecialtyModel = new SpecialtyModel();
          sp.id = ulr.specialityId;
          sp.specialtyName = ulr.specialityName;
          existing.specialties.push(sp);
        }
        else {
          let rl: RoleLocation = new RoleLocation();
          let locationList = this.getProceededLocationList();
          rl.options = this.locationList;
          rl.location = this.locationList.find(l => l.id == ulr.locationId);
          rl.otherID = ulr.otherID;
          rl.providerNumber = ulr.providerNumber;
          rl.specialties =[];
          rl.practitioners = [];

          let sp: SpecialtyModel = new SpecialtyModel();
          sp.id = ulr.specialityId;
          sp.specialtyName = ulr.specialityName;          
          rl.specialties.push(sp);
          rl.role = [];
          let rm: RoleModel = new RoleModel();
          rm.id = ulr.roleId;
          rm.roleName = roleName;
          rl.hasPractitionerRole = true;
          rl.role.push(rm);
          this.roleLocations.push(rl);
        }
      });
    }

    if(data.userPractitonerAccess && data.userPractitonerAccess.length > 0) {
      data.userPractitonerAccess.forEach(upa => {
        let existing = this.roleLocations.find(rl => rl.location && rl.location.id == upa.locationId);        
        if(existing) {
          let p: PractitionerModel = new PractitionerModel();
          p.id = upa.practitonerId;
          p.firstName = upa.name;
          existing.practitioners.push(p);
        }
      });
    }
    
  }

  getProceededLocationList() : LocationGridModel[] {
    let clonedLocations: LocationGridModel[] = this.appState.clone(this.locationList);
    this.roleLocations.forEach(rl => {
        if(rl && rl.location && rl.location.id) {
          let idx = clonedLocations.findIndex(l => l.id == rl.location.id);
          if(idx > -1) {
            clonedLocations.splice(idx, 1);
          }
        }
    });
    return clonedLocations;
  }

  populateOptions() {
    this.populateLocationList();

    this.roleService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });

    this.staffService.getPractitioners().subscribe(p => {      
      this.practitioners = p;
    });

    this.settingService.getAllSpecialties()
      .pipe(map(data => data.filter(d => d.isStatus === true) ))
      .subscribe(s => {
        this.specialties = s;
    });

    this.miscService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  populateLocationList() {
    this.businessService.getLocationsByBusiness(this.appState.userProfile.parentBusinessId).subscribe(locations => {
      this.locationList = locations;
    });
  }

  countryChanged(event: MatSelectChange) {
    // console.log(event);
    // this.locationForm.get('country').setValue(event.value);
  }

  addRoleLocation(event: Event) {
    event.preventDefault();
    let rl:RoleLocation = new RoleLocation();
    rl.location = null;
    rl.role = null;
    let locationList = this.getProceededLocationList();
    rl.options = locationList;
    rl.practitioners = [];
    this.roleLocations.push(rl);
  }

  removeRoleLocation(event: Event, idx: number) {
    event.preventDefault();
    this.roleLocations.splice(idx, 1);
  }

  openPractitionerDialog(event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(PractitionerDetailsOptionsComponent, {
      width: '1200px',
    });

    let instance = dialogRef.componentInstance;
    instance.formGroup = this.userForm;

    dialogRef.afterClosed().subscribe(result => {      
      this.clickedPractitionerOptions = true;
    });
  }

  handleLocationSelection(selected) {
    
  }

  public roleChanged(value: any[], roleLocation: RoleLocation): void {
    this.hasPractitionerRole = false;
    let result = roleLocation.role.find(r => r.roleName == "Practitioner") != null;
    roleLocation.hasPractitionerRole = result;
    this.hasPractitionerRole = result;
  }

  submitStaff() {
    let el = document.getElementById("heading");

    if(this.userForm.valid) {
      this.submitting = true;
      let staffSubmissionModel: StaffModel = this.userForm.value;
      let userLocationRoles: UserLocationRoleModel[] = this.getAllRoleLocations();
      let practitionerLocationRoles: UserLocationRolesPractitonerModel[] = this.getPractitionerLocationModel();
      let userPractitonerAccess: PractitionerLocationModel[] = this.getAllPractitionerAccess();
      
      staffSubmissionModel.userLocationRoles = userLocationRoles;
      staffSubmissionModel.userLocationRolesPractitoner = practitionerLocationRoles;
      staffSubmissionModel.userPractitonerAccess = userPractitonerAccess;

      staffSubmissionModel.isTreatmentPrivateNote = this.userForm.get("treatmentNotesPrivacy").value == "Private Notes";
      staffSubmissionModel.isTreatmentSharedNote = this.userForm.get("treatmentNotesPrivacy").value == "Shared Notes";

      if(this.photo.selectedFile) {
        staffSubmissionModel.photo = this.photo.selectedFile.src.replace('data:', '').replace(/^.+,/, '');;
      }
  
      if(this.signature.selectedFile) {
        staffSubmissionModel.signature = this.signature.selectedFile.src.replace('data:', '').replace(/^.+,/, '');;
      }

      if(this.addItem) {
        this.staffService.addStaff(staffSubmissionModel).subscribe(data => {
          this.itemid = data;
          this.addItem = false;
          this.submitting = false;
          this.displaySuccessMessage("Staff created successfully.");
          el.scrollIntoView();
        },error => {
          console.log(error);
          this.submitting = false;
          this.displayErrorMessage("Error occurred while adding staff, please try again.");
        });
      }
      else {
        staffSubmissionModel.id = this.itemid;
        this.staffService.updateStaff(staffSubmissionModel).subscribe(data => {
          this.submitting = false;
          this.displaySuccessMessage("Staff updated successfully.");
          el.scrollIntoView();
        }, error => {
          console.log(error);
          this.displayErrorMessage("Error occurred while updating staff, please try again.");
          this.submitting = false;
        });
      }
    }
  }

  private getAllRoleLocations() : UserLocationRoleModel[] {
    let userLocationRoles: UserLocationRoleModel[] = [];
    let containerPractitionerLocations: RoleLocation[] = this.appState.clone(this.roleLocations.filter(rl => rl.hasPractitionerRole === true));
    //Other Role Locations
    let otherLocations: RoleLocation[] = this.appState.clone(containerPractitionerLocations);
    otherLocations.forEach(sl => {
      sl.role = sl.role.filter(r => r.roleName != "Practitioner");
    });
    otherLocations = otherLocations.filter(rl => rl.role.length > 0);
    let standardLocations: RoleLocation[] = this.appState.clone(this.roleLocations.filter(rl => rl.hasPractitionerRole === false || !rl.hasPractitionerRole));
    standardLocations.forEach(sl => {
      sl.role = sl.role.filter(r => r.roleName != "Practitioner");
    })
    standardLocations = standardLocations.filter(rl => rl.role.length > 0);
    standardLocations = standardLocations.concat(otherLocations);

    standardLocations.forEach(sl => {
      sl.role.forEach(rl => {
        let m:UserLocationRoleModel = new UserLocationRoleModel();
        m.locationId = sl.location.id;
        m.roleId = rl.id;
        userLocationRoles.push(m);
      })
    });
    return userLocationRoles;
  }

  private getPractitionerLocationModel(): UserLocationRolesPractitonerModel[] {
    let practitionerLocationRoles: UserLocationRolesPractitonerModel[] = [];
    //Practitioner Locations
    let containerPractitionerLocations: RoleLocation[] = this.appState.clone(this.roleLocations.filter(rl => rl.hasPractitionerRole === true));
    let practitionerLocation: RoleLocation[] = this.appState.clone(containerPractitionerLocations);
    practitionerLocation.forEach(sl => {
      sl.role = sl.role.filter(r => r.roleName == "Practitioner");
    });
    practitionerLocation = practitionerLocation.filter(rl => rl.role.length > 0);
    let practitionerId = this.roles.find(r => r.roleName == "Practitioner").id;
    practitionerLocation.forEach(pl => {
      if(pl.specialties && pl.specialties.length > 0) {
        pl.specialties.forEach(sl => {
          let p:UserLocationRolesPractitonerModel = new UserLocationRolesPractitonerModel();
          p.locationId = pl.location.id;
          p.roleId = practitionerId;
          p.otherID = pl.otherID;
          p.providerNumber = pl.providerNumber;
          p.specialityId = sl.id;
          practitionerLocationRoles.push(p);
        });
      }
    });
    return practitionerLocationRoles;
  }

  private getAllPractitionerAccess(): PractitionerLocationModel[] {
    let result:PractitionerLocationModel[] = [];
    this.roleLocations.forEach(rl => {
      rl.practitioners.forEach(p => {        
        let model:PractitionerLocationModel = new PractitionerLocationModel();
        model.locationId = rl.location.id;
        model.practitonerId = p.id;
        result.push(model);
      });
    });

    return result;
  }
}

export class RoleLocation {
  location: LocationGridModel;
  role: RoleModel[];
  options: LocationGridModel[];
  hasPractitionerRole: boolean;
  otherID: string;
  providerNumber: string;
  specialties: SpecialtyModel[];
  practitioners: PractitionerModel[];
}
