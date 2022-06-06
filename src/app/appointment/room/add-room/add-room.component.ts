import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EditMode } from '@progress/kendo-angular-scheduler';
import { AppState } from 'src/app/app.state';
import { TreatmentRoomModel } from 'src/app/models/app.settings.model';
import { PractitionerSpecialityModel } from 'src/app/models/app.staff.model';
import { BusinessService } from 'src/app/services/app.business.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  @Input() rooms: TreatmentRoomModel[];
  @Input() practitioners: Array<PractitionerSpecialityModel>;
  
  @Input() public isNew = false;
  @Input() public editMode: EditMode;
  @Input() public set event(ev: any) {
      if (ev !== undefined) {
          this.editForm.reset(ev);
          this.active = true;
      }
  }
  public active = false;
  
  @Output() public cancel: EventEmitter<any> = new EventEmitter();

  @Output() public save: EventEmitter<any> = new EventEmitter();

  apperance: string = "outline";
  public steps: any = { hour: 0, minute: 30, second: 0 };
  public min: Date = new Date(2000, 2, 10, 8, 0);
  public max: Date = new Date(2002, 2, 10, 17, 0);

  public editForm: FormGroup = new FormGroup({
    'id': new FormControl(""),
    'practitioner': new FormControl("", Validators.required),
    'title': new FormControl(""),
    'start': new FormControl(''),
    'end': new FormControl(''),
    'isAllDay': new FormControl(false),
    'recurrenceRule': new FormControl(),
    'recurrenceID': new FormControl(),
    'locationId': new FormControl(""),
    'roomId': new FormControl("", Validators.required),
    'practitionerId': new FormControl("")
  });

  public get isEditingSeries(): boolean {
    return this.editMode === EditMode.Series;
  }

  get selectedRoom(): any {
    return this.editForm.get("roomId").value;
  }

  get selectedPractitioner(): any {
    return this.editForm.get("practitioner").value;
  }

  constructor(private appState: AppState,
              private businessService: BusinessService
    ) { }

  ngOnInit() {
    this.editForm.get("start").valueChanges.subscribe(p => {
      this.populateTitle();
    });

    this.editForm.get("end").valueChanges.subscribe(p => {
      this.populateTitle();
    });

    this.appState.selectedUserLocationState.subscribe(l => {
      this.onCancel(null);
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
    this.editForm.get("locationId").setValue(this.appState.selectedUserLocationId);
    let p = this.editForm.get("practitioner").value;
    if(p) {
      this.editForm.get("practitionerId").setValue(p.practitionerId);
    }

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
