import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { BaseEditService, SchedulerModelFields } from '@progress/kendo-angular-scheduler';
import { parseDate } from '@progress/kendo-angular-intl';
import { RoomEvent } from '../models/app.appointment.model';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
    recurrenceExceptions: 'recurrenceException'
};

@Injectable()
export class RoomEditService extends BaseEditService<RoomEvent> {
    public loading = false;

    private tempData: RoomEvent[] = [];

    start: Date;
    end: Date;

    constructor(
        private appState: AppState
        ) {
        super(fields);
    }

    setDateRange(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    public read(): void {
        // if (this.data.length) {
        //     this.source.next(this.data);
        //     return;
        // }

        this.fetch().pipe(
            map(items => items.filter(d => d.locationId == this.appState.selectedUserLocationId))
        ).subscribe(data => {
            this.data = data.map(item => this.readEvent(item));
            this.source.next(this.data);
            this.loading = false;
        });
    }

    protected save(created: RoomEvent[], updated: RoomEvent[], deleted: RoomEvent[]): void {
        const completed = [];
        if (deleted.length) {
            completed.push(this.fetch(REMOVE_ACTION, deleted));
        }

        if (updated.length) {
            completed.push(this.fetch(UPDATE_ACTION, updated));
        }

        if (created.length) {
            completed.push(this.fetch(CREATE_ACTION, created));
        }
        
        zip(...completed).subscribe(() => this.read());
    }

    protected fetch(action: string = '', data?: any): Observable<RoomEvent[]> {
        this.loading = true;

        if(action && data && data.length > 0) {
            data.forEach(element => {
                switch(action) {
                    case CREATE_ACTION:
                        element.id = this.tempData.length + 1;
                        this.tempData.push(element);
                        break;
                    case UPDATE_ACTION:
                        let d = this.tempData.find(t => t.id == element.id);
                        Object.keys(d).forEach(k => {                            
                            d[k] = element[k]
                        });
                        break;
                    case REMOVE_ACTION:
                        //TODO:
                        break;
                }
            });
            
        }

        return of(this.tempData)
    }

    private readEvent(item: any): RoomEvent {        
        return {
            ...item,
            start: parseDate(item.start),
            end: parseDate(item.end),
            recurrenceException: this.parseExceptions(item.recurrenceException),
            type: "Room"
        };
    }
}
