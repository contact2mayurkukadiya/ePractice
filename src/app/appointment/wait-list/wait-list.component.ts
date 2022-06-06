import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { WaitListEvent } from 'src/app/models/app.appointment.model';
import { AppointmentService } from 'src/app/services/app.appointment.service';

@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.component.html',
  styleUrls: ['./wait-list.component.css']
})
export class WaitListComponent implements OnInit {
  @Input() PractitionerId: string;
  @Input() Start: Date;  
  @Input() End: Date;
  @Output() public onEventClick: EventEmitter<any> = new EventEmitter();

  constructor(public appointmentService: AppointmentService,
              public appState: AppState
    ) { }

  waitLists: WaitListEvent[] = [];

  ngOnInit() {
    
    let start: Date = new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);

    let end: Date = new Date();
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    end.setDate(end.getDate() + 1);

    this.refreshWaitlist(start, end);
  }

  refreshWaitlist(start: Date, end: Date) {
    this.Start = new Date(start);
    this.End = new Date(end);
    
    this.appointmentService.getAllPractitionerWaitListDetails(this.appState.selectedUserLocationId).pipe(
      map(
        items => items.filter(i => 
            i.practitionerId == this.PractitionerId
          )
      )
    ).subscribe(data => {
      data.forEach(d => {
        d.availableFrom = new Date(d.availableFrom);
        d.availableUntil = new Date(d.availableUntil);
        d.firstAvailableDate = new Date(d.firstAvailableDate);  
        d.display = false;        
        if(d.waitListDays && d.waitListDays.length > 0) {
          d.waitListDays.forEach(day => {
            let dateDay = new Date(day);
  
            let match = (dateDay >= this.Start && dateDay < this.End);
            if(match) {
              d.display = true;
              return;
            }
          });
        }else {
          d.display = true;
        }        
      });
      this.waitLists = data.filter(d => d.display === true);      
    });
  }

  onWaitlistClick(event: MouseEvent, waitlist: WaitListEvent) {
    event.preventDefault();
    this.onEventClick.emit(waitlist);
  }
}
