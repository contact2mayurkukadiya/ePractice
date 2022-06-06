import { EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditMode } from '@progress/kendo-angular-scheduler';
import { of } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { ApplicationDataEnum } from 'src/app/enum/application-data-enum';
import { PractitionerSpecialityModel } from 'src/app/models/app.staff.model';
import { ApplicationDataService } from 'src/app/services/app.applicationdata.service';
import { BusinessService } from 'src/app/services/app.business.service';
import { StaffService } from 'src/app/services/app.staff.service';

@Component({
  selector: 'app-add-break',
  templateUrl: './add-break.component.html',
  styleUrls: ['./add-break.component.css']
})
export class AddBreakComponent implements OnInit {
  @Input() public isNew = false;
  @Input() public editMode: EditMode;
  @Input() public set event(ev: any) {
      if (ev !== undefined) {
          this.editForm.reset(ev);
          this.active = true;
          if(ev && ev.breakId) {
            this.breakNameId = parseInt(ev.breakId);
          }
      }
  }
  public active = false;
  
  @Output() public cancel: EventEmitter<any> = new EventEmitter();
  @Output() public save: EventEmitter<any> = new EventEmitter();

  apperance: string = "outline";
  public steps: any = { hour: 0, minute: 30, second: 0 };
  public min: Date = new Date(2000, 2, 10, 8, 0);
  public max: Date = new Date(2002, 2, 10, 17, 0);
  Practitioners: Array<PractitionerSpecialityModel> = [];

  breakNameParentId: number = ApplicationDataEnum.BreakName;
  breakNameId: number;

  public editForm: FormGroup = new FormGroup({
    'id': new FormControl(""),
    'title': new FormControl(""),
    'start': new FormControl('', Validators.required),
    'end': new FormControl('', Validators.required),
    'isAllDay': new FormControl(false),
    'recurrenceRule': new FormControl(),
    'recurrenceID': new FormControl(),
    'bookOnline': new FormControl(false),
    'note': new FormControl(),
    'locationId': new FormControl(""),
    'specialityPractitionerId': new FormControl(0),
    'practitionerId': new FormControl("", Validators.required),
    'breakId': new FormControl(null, Validators.required),
    'breakName': new FormControl("")
  });

  public get isEditingSeries(): boolean {
    return this.editMode === EditMode.Series;
  }

  get selectedPractitioner(): PractitionerSpecialityModel {
    let pId = this.editForm.get("practitionerId").value
    return this.Practitioners.find(p => p.practitionerId == pId);
  }

  constructor(private appState: AppState,
              private businessService: BusinessService,
              private staffService: StaffService,
              private appDataService: ApplicationDataService
    ) { }

  ngOnInit() {
    this.editForm.get("start").valueChanges.subscribe(p => {
      this.populateTitle();
    });

    this.editForm.get("end").valueChanges.subscribe(p => {
      this.populateTitle();
    });

    this.editForm.get("breakId").valueChanges.subscribe(v => {
      this.breakNameId = this.editForm.get("breakId").value;
    });

    this.appState.selectedUserLocationState.subscribe(l => {
      this.onCancel(null);
    });

    this.staffService.getAllSpecialityPractitoners()
    .subscribe(sp => {
      sp.forEach(s => {
        s.photo = s.photo ? `data:image/jpeg;base64,${s.photo}` : null;
        s.selected = false;
        s.color = "#a18bd6";
      });
      this.Practitioners = sp;
    });
  }

  appIdBreakNameChangedHandler($event) {
    this.breakNameId = $event;
    this.editForm.get("breakId").setValue(this.breakNameId);
    this.appDataService.getApplicationDataById($event).subscribe(d => {
      this.editForm.get("breakName").setValue(d.categoryName);
    });
  }

  populateTitle() {
    if(this.editForm.get("start").value && this.editForm.get("end").value) {
      let startTime = this.formatAMPM(this.editForm.get("start").value);
      let endTime = this.formatAMPM(this.editForm.get("end").value);
      let timeTitle = `${startTime} - ${endTime}`;
      this.editForm.get("title").setValue(timeTitle);
    }
  }

  loadLocationSettings() {
    let location = this.appState.selectedUserLocation;
    if(location) {
      this.businessService.getLocation(location.id).subscribe(l => {
        if(l.startTime && l.endTime) {
          let s: Date = new Date(l.startTime);
          let e: Date = new Date(l.endTime);
          this.min.setHours(s.getHours());
          this.min.setMinutes(s.getMinutes());
          this.max.setHours(e.getHours());
          this.max.setMinutes(e.getMinutes());
        }

        if(l.timeSlot) {
          let minute = parseInt(l.timeSlot);
          this.steps = { hour: 0, minute: minute, second: 0 };
        }
      });
    }
  }

  onCancel(e) {
    if(e) {
      e.preventDefault();
    }
    
    this.active = false;
    this.cancel.emit();
  }

  onSave(e) {
    e.preventDefault();
    this.save.emit(this.editForm.value);
    this.editForm.reset();
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return strTime;
  }

}
