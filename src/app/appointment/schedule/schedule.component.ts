import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../../app.state';
import { DateChangeEvent, SlotClickEvent, EventClickEvent, CrudOperation, EditMode, RemoveEvent, SlotClassArgs } from '@progress/kendo-angular-scheduler';
import '@progress/kendo-date-math/tz/all';
import { StaffService } from '../../services/app.staff.service';
import { PractitionerSpecialityModel, GroupSpecialityPractitonerModel } from '../../models/app.staff.model';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';
import { ScheduleEvent } from 'src/app/models/app.appointment.model';
import { BusinessService } from 'src/app/services/app.business.service';
import { ScheduleEditService } from 'src/app/services/app.schedule.editservice';
import { filter } from 'rxjs/operators';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css', '../../appointment/appointment.component.css']
})

export class ScheduleComponent implements OnInit {
  @ViewChild(AddScheduleComponent, { static: false }) addSchedule: AddScheduleComponent;

  constructor(public appState: AppState,
    private staffService: StaffService,
    private businessService: BusinessService,
    public editService: ScheduleEditService,
    private cd: ChangeDetectorRef) { 

  }

  public numberOfPractitioners: number = 0;
  public alreadyAdded: boolean = false;

  resourceData: PractitionerSpecialityModel[] = [];
  public practitioners: Array<PractitionerSpecialityModel>;
  public specialityPractitioners: GroupSpecialityPractitonerModel[];

  panelExpandSize: string = "300px";
  panelCollaspeSize: string = "200px";
  panelSize: string = this.panelExpandSize;
  panelExpand: boolean = true;

  resource: boolean = false;

  sliderTitle: string = "Add Schedule";

  slotDuration: number = 60;

  _startTime: string = "7:00";
  _endTime: string = "19:00";
  public editedEvent: any;
  public editMode: EditMode;
  public isNew: boolean;
  public selectedDate: Date;
  public events: ScheduleEvent[];
  public group: any = {
      resources: ['Specialities'],
      orientation: 'horizontal'
  };

  public resources: any[] = [{
      name: 'Specialities',
      data: [],
      field: 'practitionerId',
      valueField: 'practitionerId',
      textField: 'text',
      colorField: 'color',
      multiple: false
  }];

  ngOnInit() {
    this.appState.sideNavState.next(false);
    this.loadLocationTime();
    this.loadEvents();
  }

  loadEvents() {
    this.appState.selectedUserLocationIdState.subscribe(l => {
      this.editService.read();
      this.loadLocationTime();
    });

    this.editService.read();

    this.editService.events.subscribe(e => {
        this.alreadyAdded = e && e.length > 0;
    });

    this.staffService.getAllSpecialityPractitoners()
    .subscribe(sp => {
      sp.forEach(s => {
        s.photo = s.photo ? `data:image/jpeg;base64,${s.photo}` : null;
        s.selected = false;
        s.color = "#a18bd6";
      });
      this.resourceData = sp;
      this.practitioners = sp;

      if(this.alreadyAdded) {
        this.onPractitionerClick(this.practitioners[0]);
      }
    });

    this.staffService.getAllGroupSpecialityPractitoners().subscribe(data => {
      data.forEach(s => {
        s.practitioners.forEach(p => {
          p.photo = p.photo ? `data:image/jpeg;base64,${p.photo}` : null;
        });
      });

      this.specialityPractitioners = data;
    });
  }

  loadLocationTime() {
    if(this.appState.selectedUserLocationId) {
      this.businessService.getLocation(this.appState.selectedUserLocationId).subscribe(l => {
        this.slotClass = l.timeSlotSize;        
        if(l.startTime && l.endTime) {
          let s: Date = new Date(l.startTime);
          let e: Date = new Date(l.endTime);
          let startTime = `${s.getHours()}:${s.getMinutes()}`;
          let endTime = `${e.getHours()}:${e.getMinutes()}`;
          this._startTime = startTime;
          this._endTime = endTime;
          if(l.timeSlot) {
            this.slotDuration = l.timeSlot;
          }
        }
      });
    }
  }

  slotClass: string;

  public getSlotClass = (args: SlotClassArgs) => {
    return {
       'small': this.slotClass == "Small", 
       'medium': this.slotClass == "Medium", 
       'default': this.slotClass == "Default", 
       'large': this.slotClass == "Large", 
       'big': this.slotClass == "Big" 
    };
  }


  public onPractitionerClick(c) {
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
    let selected = this.practitioners.filter(c => c.selected);
    if(selected) {
      let selectedIds = selected.map(s => s.practitionerId);
      let filtered = this.resourceData.filter(r => selectedIds.indexOf(r.practitionerId) >= 0);
      this.updateResourceData(filtered);
      this.numberOfPractitioners = filtered.length;
    }
  }

  private updateResourceData(data) {
    let resource = this.resources.find(r => r.name == "Specialities");
    resource.data = data;
    this.onOrientationChange('horizontal');
  }

  public onOrientationChange(value: any): void {
      this.group = { ...this.group, orientation: value };
  }

  public onDateChange(args: DateChangeEvent): void {
    this.editService.setDateRange(args.dateRange.start, args.dateRange.end);
    this.editService.read();
    this.cd.detectChanges();
  }

  openSlider() {
    document.getElementById('schedule_slider').style.width = '700px';
    document.getElementById("schedule_sliderShadow").style.display = "block";
    this.addSchedule.loadLocationSettings();
  }

  closeSlider() {
    document.getElementById('schedule_slider').style.width = '0px';
    document.getElementById("schedule_sliderShadow").style.display = "none";
  }

  toggleTitle() {
    let t: string;
    t = "Schedule";
    this.sliderTitle = this.isNew ? `Add ${t}` : `Update ${t}`;
  }

  private clickedDataItem: any = null;
  private clickSender: any = null;

  public slotDblClickHandler({ start, end, isAllDay, originalEvent, sender }: SlotClickEvent): void {
    let e: MouseEvent = originalEvent;
    let slot = sender.slotByPosition(e.pageX, e.pageY);
    let p_id = slot && slot.resources && slot.resources.length > 0 ? slot.resources[0].practitionerId : "";
    this.isNew = true;
    this.toggleTitle();
    this.clickedDataItem = null;
    this.clickSender = sender;

    this.editMode = EditMode.Series;

    this.editedEvent = {
      start: start,
      end: end,
      isAllDay: isAllDay,
      practitioner: this.practitioners.find(p => p.practitionerId == p_id),
      practitionerId: p_id
    };
    
    this.openSlider();
  }

  eventDblClickHandler({ sender, event }: EventClickEvent): void {
    this.isNew = false;
    this.toggleTitle();
    let dataItem = event.dataItem;
    this.clickedDataItem = dataItem;
    this.clickSender = sender;

    dataItem.practitioner = this.practitioners.find(p => p.practitionerId == event.dataItem.practitionerId);
    dataItem.practitionerId = event.dataItem.practitionerId;

    if (this.editService.isRecurring(dataItem)) {
        sender.openRecurringConfirmationDialog(CrudOperation.Edit)
              // The dialog will emit `undefined` on cancel
              .pipe(filter(editMode => editMode !== undefined))
              .subscribe((editMode: EditMode) => {
                  if (editMode === EditMode.Series) {
                    dataItem = this.editService.findRecurrenceMaster(dataItem);
                    dataItem.practitioner = this.practitioners.find(p => p.practitionerId == event.dataItem.practitionerId);
                    dataItem.practitionerId = event.dataItem.practitionerId;
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
    if (this.addSchedule.isNew) {
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

  removeItem() {
    if(this.clickedDataItem && this.clickSender) {
      let r: RemoveEvent = new RemoveEvent(this.clickSender, { dataItem: this.clickedDataItem });
      this.removeHandler(r);
      this.closeSlider();
    }    
  }

  removeHandler({ sender, dataItem }: RemoveEvent) {
    if (this.editService.isRecurring(dataItem)) {
        sender.openRecurringConfirmationDialog(CrudOperation.Remove)
              // result will be undefined if the Dialog was closed
              .pipe(filter(editMode => editMode !== undefined))
              .subscribe((editMode) => {
                  this.handleRemove(dataItem, editMode);
              });
    } else {
        sender.openRemoveConfirmationDialog().subscribe((shouldRemove) => {
            if (shouldRemove) {
                this.editService.remove(dataItem);
            }
        });
    }
  }

  private handleRemove(item: any, mode: EditMode): void {
    const service = this.editService;
    if (mode === EditMode.Series) {
        service.removeSeries(item);
    } else if (mode === EditMode.Occurrence) {
        if (service.isException(item)) {
            service.remove(item);
        } else {
            service.removeOccurrence(item);
        }
    } else {
        service.remove(item);
    }
  }

  onCancel(event) {
    this.closeSlider();
  }

  onNavigate(event) {
    this.hideAllPopover();
  }

  onBreakClick(event: MouseEvent, id) {
    event.preventDefault();
    this.hidePopover(id);
    this.openSlider();
  }

  onClassClick(event: MouseEvent, id) {
    event.preventDefault();
    this.hidePopover(id);
  }

  onAppointmentClick(event: MouseEvent, id) {
    event.preventDefault();
    this.hidePopover(id);
  }

  onShowPopoverClick(event: SlotClickEvent) {
    if(event.resources && event.resources.length > 0) {
      let id = event.resources[0].practitionerId;
      let e = event.originalEvent;
      this.showPopover(id, e);
    }
  }

  onClosePopoverClick(event: MouseEvent, id: string) {
    this.hidePopover(id);
  }

  hideAllPopover() {
    this.resourceData.forEach(r => {
      this.hidePopover(r.practitionerId);
    });
  }

  showPopover(id: string, e: MouseEvent) {
    this.hideAllPopover();
    // let p = document.querySelector("#pop_" + id);
    let p: Element = e.target as Element;
    let t:HTMLElement = document.querySelector("#tp_" + id);
    t.setAttribute('data-show', '');
    createPopper(p, t, {
      placement: 'bottom'
    });
  }

  hidePopover(id: string) {
    let t:HTMLElement = document.querySelector("#tp_" + id);
    t.removeAttribute("data-show");
  }

}

