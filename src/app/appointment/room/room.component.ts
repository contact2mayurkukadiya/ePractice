import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../../app.state';
import { DateChangeEvent, SlotClickEvent, SchedulerComponent, EventClickEvent, CrudOperation, EditMode, } from '@progress/kendo-angular-scheduler';
import '@progress/kendo-date-math/tz/all';
import { ScheduleEvent } from 'src/app/models/app.appointment.model';
import { BusinessService } from 'src/app/services/app.business.service';
import { filter, map } from 'rxjs/operators';
import { RoomEditService } from 'src/app/services/app.room.editservice';
import { AddRoomComponent } from './add-room/add-room.component';
import { StaffService } from 'src/app/services/app.staff.service';
import { PractitionerSpecialityModel } from 'src/app/models/app.staff.model';
import { TreatmentRoomModel } from 'src/app/models/app.settings.model';
import { SettingsService } from 'src/app/services/app.settings.service';
import { AppointmentHeaderComponent } from '../appointment-header/appointment-header.component';

const Rooms: TreatmentRoomModel[] = [];

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @ViewChild(AddRoomComponent, { static: true }) addRoomComp: AddRoomComponent;
  @ViewChild(SchedulerComponent, { static: true }) scheduler: SchedulerComponent;
  @ViewChild(AppointmentHeaderComponent, { static: true }) header: AppointmentHeaderComponent;

  constructor(public appState: AppState,
    private staffService: StaffService,
    private businessService: BusinessService,
    private settingsService: SettingsService,
    public editService: RoomEditService,
    private cd: ChangeDetectorRef) { }

  public numberOfPractitioners: number = 0;
  public alreadyAdded: boolean = false;
  public practitioners: Array<PractitionerSpecialityModel>;

  selectedViewIndex: number = 0;
  resourceData: any[] = [];
  public rooms: Array<TreatmentRoomModel>;

  panelExpandSize: string = "300px";
  panelCollaspeSize: string = "200px";
  panelSize: string = this.panelExpandSize;
  panelExpand: boolean = true;

  resource: boolean = false;

  sliderTitle: string = "Add Room";


  _startTime: string = "7:00";
  _endTime: string = "19:00";
  public editedEvent: any;
  public editMode: EditMode;
  public isNew: boolean;
  public selectedDate: Date;
  public events: ScheduleEvent[];
  public group: any = {
    resources: ['Rooms'],
    orientation: 'horizontal'
  };

  public resources: any[] = [
    {
      name: 'Rooms',
      data: [],
      field: 'roomId',
      valueField: 'id',
      textField: 'text',
      colorField: 'color',
      multiple: false
    }];

  ngOnInit() {
    this.appState.sideNavState.next(false);

    // this.header.onlyEnableFor("Rooms");

    this.appState.selectedUserLocationIdState.subscribe(l => {
      this.loadTreatmentRooms();
      this.editService.read();
    });

    this.loadTreatmentRooms();
    this.editService.read();

    this.staffService.getAllSpecialityPractitoners().subscribe(sp => {
      sp.forEach(s => {
        s.photo = s.photo ? `data:image/jpeg;base64,${s.photo}` : null;
        s.selected = false;
      });
      this.practitioners = sp;
    });

  }

  loadTreatmentRooms() {
    this.settingsService.getAllTreatmentRooms().pipe(
      map(items => items.filter(r => r.isAllowAllLocation || r.treatmentLocation.find(t => t.locationId == this.appState.selectedUserLocationId) != null))
    ).subscribe(data => {
      this.rooms = data;
      this.resourceData = data;
      if (data.length > 0) {
        this.onRoomClick(this.rooms[0]);
      }
    });
  }

  loadLocationTime() {
    let location = this.appState.selectedUserLocation;
    if (location) {
      this.businessService.getLocation(location.id).subscribe(l => {
        if (l.startTime && l.endTime) {
          let s: Date = new Date(l.startTime);
          let e: Date = new Date(l.endTime);
          let startTime = `${s.getHours()}:${s.getMinutes()}`;
          let endTime = `${e.getHours()}:${e.getMinutes()}`;
          this._startTime = startTime;
          this._endTime = endTime;
        }
      });
    }
  }

  public onRoomClick(c) {
    c.selected = !c.selected;
    this.updateResources();
  }

  public onSpecailityClick(s) {
    s.expand = !s.expand;
  }

  public togglePanel(e) {
    this.panelExpand = !this.panelExpand;
    this.panelSize = this.panelExpand ? this.panelExpandSize : this.panelCollaspeSize;
  }

  public updateResources() {
    let selected = this.rooms.filter(c => c.selected);
    if (selected) {
      let selectedIds = selected.map(s => s.id);
      let filtered = this.resourceData.filter(r => selectedIds.indexOf(r.id) >= 0);
      this.updateResourceData(filtered);
      this.numberOfPractitioners = filtered.length;
    }
  }

  private updateResourceData(data) {
    let resource = this.resources.find(r => r.name == "Rooms");
    resource.data = data;
    this.onOrientationChange('horizontal');
  }

  public onOrientationChange(value: any): void {
    this.group = { ...this.group, orientation: value };
  }

  public onDateChange(args: DateChangeEvent): void {
    this.editService.read();
    this.cd.detectChanges();
  }

  openSlider() {
    document.getElementById('room_slider').style.width = '700px';
    document.getElementById("room_sliderShadow").style.display = "block";
    this.addRoomComp.loadLocationSettings();
  }

  closeSlider() {
    document.getElementById('room_slider').style.width = '0px';
    document.getElementById("room_sliderShadow").style.display = "none";
  }


  toggleTitle() {
    this.sliderTitle = this.isNew ? "Add Room" : "Update Room";
  }

  public slotDblClickHandler({ start, end, isAllDay, originalEvent, sender }: SlotClickEvent): void {
    // let srcElement = originalEvent.srcElement;
    // let name = this.getPratitionerName(srcElement);
    this.isNew = true;
    this.toggleTitle();

    this.editMode = EditMode.Series;

    this.editedEvent = {
      start: start,
      end: end,
      isAllDay: isAllDay,
    };

    this.openSlider();
  }

  eventDblClickHandler({ sender, event, originalEvent }: EventClickEvent): void {
    this.isNew = false;
    this.toggleTitle();
    let dataItem = event.dataItem;

    if (this.editService.isRecurring(dataItem)) {
      sender.openRecurringConfirmationDialog(CrudOperation.Edit)
        // The dialog will emit `undefined` on cancel
        .pipe(filter(editMode => editMode !== undefined))
        .subscribe((editMode: EditMode) => {
          if (editMode === EditMode.Series) {
            dataItem = this.editService.findRecurrenceMaster(dataItem);
          }
          this.editMode = editMode;
          this.editedEvent = dataItem;
        });
    } else {
      this.editMode = EditMode.Series;
      this.editedEvent = dataItem;
    }

    this.openSlider();
  }

  onScheduleSave(formValue: any) {
    if (this.addRoomComp.isNew) {
      this.editService.create(formValue);
    } else {
      this.handleUpdate(this.editedEvent, formValue, this.editMode);
    }

    this.editService.read();
    this.closeSlider();
    this.cd.detectChanges();
    this.onOrientationChange('horizontal');
  }

  private handleUpdate(item: any, value: any, mode: EditMode): void {
    const service = this.editService;
    if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
        service.update(item, value);
      } else {
        service.createException(item, value);
      }
    } else {
      // Item is not recurring or we're editing the entire series
      service.update(item, value);
    }
  }

  onCancel(event) {
    this.closeSlider();
  }
}
