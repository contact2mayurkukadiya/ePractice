import { Injectable } from '@angular/core';

import { Observable, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BaseEditService, SchedulerModelFields } from '@progress/kendo-angular-scheduler';
import { parseDate } from '@progress/kendo-angular-intl';

import { AppointmentEvent, ScheduleEvent } from '../models/app.appointment.model';
import { AppointmentService } from './app.appointment.service';
import { AppState } from '../app.state';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const fields: SchedulerModelFields = {
    id: 'id',
    title: 'title',
    description: 'description',
    startTimezone: 'startTimezone',
    start: 'start',
    end: 'end',
    endTimezone: 'endTimezone',
    isAllDay: 'isAllDay',
    recurrenceRule: 'recurrenceRule',
    recurrenceId: 'recurrenceID',
    recurrenceExceptions: 'recurrenceExceptions'
};

@Injectable()
export class AppointmentEditService extends BaseEditService<AppointmentEvent> {
    public loading = false;

    constructor(private appointmentService: AppointmentService,
                private appState: AppState
        ) {
        super(fields);
    }

    start: Date;
    end: Date;
    appointments: any[] = [];

    setDefaultRange() {
        //set to today start and end
        let e = new Date();
        e.setHours(0);
        e.setMinutes(0);
        e.setSeconds(0);
        e.setDate(e.getDate() + 1);

        let s = new Date();
        s.setHours(0);
        s.setMinutes(0);
        s.setSeconds(0);
        
        this.start = s;
        this.end = e;
    }

    setDateRange(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }
    
    public read(): void {
        if(!this.start && !this.end) {
            this.setDefaultRange();
        }

        this.fetch().pipe(
            map(items => items.filter(d => d.type != "Schedule"))
        ).subscribe(data => {
            this.data = data.map(item => this.readEvent(item));                            
            this.source.next(this.data);            
        });
    }

    protected save(created: AppointmentEvent[], updated: AppointmentEvent[], deleted: AppointmentEvent[]): void {
        const completed = [];
        if (deleted.length) {
            completed.push(this.action(REMOVE_ACTION, deleted));
        }

        if (updated.length) {
            completed.push(this.action(UPDATE_ACTION, updated));
        }

        if (created.length) {
            completed.push(this.action(CREATE_ACTION, created));
        }
        
        zip(...completed).subscribe(() => this.read());
    }

    protected action(action: string = '', data?: any): Observable<any> {
        this.loading = true;
        let e: Observable<any>;

        if(action && data && data.length > 0) {
            data.forEach(element => {                
                switch(action) {
                    case CREATE_ACTION:
                        e = this.appointmentService.createBreak(element);
                        break;
                    case UPDATE_ACTION:
                        e = this.appointmentService.updateBreak(element);
                        break;
                    case REMOVE_ACTION:                        
                        e = this.appointmentService.deleteBreak(element.id);
                        break;
                }
            });
        }

        return e;
    }

    protected fetch(): Observable<any[]> {        
        return this.appointmentService.getAllPractitionerEventDetails(this.appState.selectedUserLocationId).pipe(
            map(res => <any[]>res),
            tap(() => this.loading = false)
        );
    }

    private readEvent(item: any): AppointmentEvent {        
        return {
            ...item,
            start: parseDate(item.start),
            end: parseDate(item.end),
            recurrenceException: this.parseExceptions(item.recurrenceExceptions),            
        };
    }
}
