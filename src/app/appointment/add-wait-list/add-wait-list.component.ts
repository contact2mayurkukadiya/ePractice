import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppState } from 'src/app/app.state';
import { PractitionerSpecialityModel } from 'src/app/models/app.staff.model';
import { BusinessService } from 'src/app/services/app.business.service';
import { OfferingsService } from 'src/app/services/app.offerings.service';
import { PatientService } from 'src/app/services/app.patient.service';
import { StaffService } from 'src/app/services/app.staff.service';

@Component({
  selector: 'app-add-wait-list',
  templateUrl: './add-wait-list.component.html',
  styleUrls: ['./add-wait-list.component.css']
})
export class AddWaitListComponent implements OnInit {
  @Input() public isNew = false;
  @Input() public readOnly = false;
  @Input() public set event(ev: any) {
    this.editForm.reset();    
    if (ev !== undefined) {
        this.editForm.reset(ev);        
        if(ev.availableDays) {
          let splitDays = ev.availableDays.split(',');
          this.weeks.forEach(w => {
            w.selected = splitDays.indexOf(w.value) >= 0;            
          });          
        }
    }    
  }

  @Output() public cancel: EventEmitter<any> = new EventEmitter();
  @Output() public save: EventEmitter<any> = new EventEmitter();

  public defaultItem: { preferredName: string, id: number } = { preferredName: "Search by Name or Mobile Number", id: null };

  apperance: string = "outline";
  public steps: any = { hour: 0, minute: 30, second: 0 };
  public min: Date = new Date(2000, 2, 10, 8, 0);
  public max: Date = new Date(3000, 12, 31, 17, 0);
  
  Practitioners: Array<PractitionerSpecialityModel> = [];
  services: any[] = [];
  patients: any[] = [];

  patientsData: any[] = [];

  public editForm: FormGroup = new FormGroup({
    'id': new FormControl(""),
    'parentBusinessId': new FormControl(""),
    'locationId': new FormControl(""),
    'patientId': new FormControl("", { 
      validators: Validators.required,      
      updateOn: 'change'
    }),
    'patientName': new FormControl(''),
    'practitionerId': new FormControl('', { 
      validators: Validators.required,      
      updateOn: 'change'
    }),
    'practitionerName': new FormControl(false),
    'serviceId': new FormControl(""),
    'serviceName': new FormControl(""),
    'firstAvailableDate': new FormControl(),
    'availableFrom': new FormControl(),
    'availableUntil': new FormControl(new Date()),
    'availableDays': new FormControl("", Validators.required),
    'keepInWaitListUntil': new FormControl(),
    'isHighPriority': new FormControl(false),
    'notes': new FormControl("")
  });

  weeks: any[] = [
    {
      title: "M",
      value: "Monday",
      selected: false
    },
    {
      title: "T",
      value: "Tuesday",
      selected: false
    },
    {
      title: "W",
      value: "Wednesday",
      selected: false
    },
    {
      title: "T",
      value: "Thursday",
      selected: false
    },
    {
      title: "F",
      value: "Friday",
      selected: false
    },
    {
      title: "S",
      value: "Saturday",
      selected: false
    },
    {
      title: "S",
      value: "Sunday",
      selected: false
    }
  ]

  get selectedPractitioner(): any {
    let pId = this.editForm.get("practitionerId").value;
    return this.Practitioners.find(p => p.practitionerId == pId);
  }

  get selectedPatient(): any {
    let pId = this.editForm.get("patientId").value;
    return this.patients.find(p => p.id == pId);
  }

  get selectedService(): any {
    let sId = this.editForm.get("serviceId").value;
    return this.services.find(s => s.id == sId);
  }

  constructor(public offeringService: OfferingsService,
              public patientService: PatientService,
              public staffService: StaffService,
              private businessService: BusinessService,
              public appState: AppState
    ) { }

  ngOnInit() {
    this.loadServices();
    this.loadPatients();
    this.loadPractitioners();
    this.loadLocationSettings();
  }

  loadLocationSettings() {
    let location = this.appState.selectedUserLocation;
    if(location) {
      this.businessService.getLocation(location.id).subscribe(data => {      
        let s = new Date(data.startTime);
        let e = new Date(data.endTime);
        s.setSeconds(0);
        s.setMilliseconds(0);
        e.setSeconds(59);
        e.setMilliseconds(59);

        if(data.startTime) {
          data.startTime = s;
        }
        if(data.endTime) {
          data.endTime = e;
        }

        this.min = data.startTime;
        this.max = data.endTime;

        if(data.timeSlot) {
          let minute = parseInt(data.timeSlot);
          this.steps = { hour: 0, minute: minute, second: 0 };
        }
      });
    }
  }

  loadServices() {
    this.offeringService.getAllService().subscribe(s => {
      this.services = s;
    });
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe(p => {
      this.patients = p;      
      this.patientsData = p;
    });
  }

  loadPractitioners() {
    this.staffService.getAllSpecialityPractitonersByLocId(this.appState.selectedUserLocationId)
    .subscribe(sp => {
      sp.forEach(s => {
        s.photo = s.photo ? `data:image/jpeg;base64,${s.photo}` : null;
        s.selected = false;
        s.color = "#a18bd6";
      });
      this.Practitioners = sp;
    });
  }

  onSave(e) {
    e.preventDefault();

    if(!this.editForm.get("id").value) {
      this.editForm.get("id").setValue("00000000-0000-0000-0000-000000000000");
    }

    this.editForm.get("locationId").setValue(this.appState.selectedUserLocationId);
     
    this.editForm.get("parentBusinessId").setValue(this.appState.userProfile.parentBusinessId);

    let patientId = this.editForm.get("patientId").value;
    let practitionerId =  this.editForm.get("practitionerId").value;
    let serviceId =  this.editForm.get("serviceId").value;

    let selectedService = this.services.find(s => s.id == serviceId);
    let selectedPractitioner = this.Practitioners.find(p => p.practitionerId == practitionerId);
    let selectedPatient = this.patients.find(p => p.id == patientId);

    if(this.selectedPatient) {
      this.editForm.get("patientName").setValue(selectedPatient.preferredName);
    }
    
    if(this.selectedPractitioner) {
      this.editForm.get("practitionerName").setValue(selectedPractitioner.practitionerId);
    }
    
    if(this.selectedService) {
      this.editForm.get("serviceName").setValue(selectedService.serviceName);
    }
    
    this.save.emit(this.editForm.value);
    this.editForm.reset();
  }

  onCancel(e) {
    if(e) {
      e.preventDefault();
    }

    this.weeks.forEach(w => w.selected = false);
    this.editForm.reset();
    this.cancel.emit();
  }

  onWeekdayClick(d) {
    if(!this.readOnly) {
      d.selected = !d.selected;

      let days = this.weeks.filter(w => w.selected === true).map(w => w.value).join(",");
      this.editForm.get("availableDays").setValue(days);   
    }    
  }

  handleFilter(value) {
    this.patientsData = this.patients.filter((s) => s.preferredName.toLowerCase().indexOf(value.toLowerCase()) !== -1 || s.mobile.indexOf(value) !== -1);
  }

  public itemDisabled(itemArgs: { dataItem: any, index: number }) {    
    return itemArgs.dataItem.id === null;
  }
}
