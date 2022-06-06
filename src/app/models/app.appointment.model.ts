import { SchedulerEvent } from '@progress/kendo-angular-scheduler';

export interface Appointment {
    TaskID?: number;
    OwnerID?: number;
    Title?: string;
    Description?: string;
    Start?: Date;
    End?: Date;
    StartTimezone?: string;
    EndTimezone?: string;
    IsAllDay?: boolean;
    RecurrenceException?: any;
    RecurrenceID?: number;
    RecurrenceRule?: string;
}

export interface ScheduleEvent extends SchedulerEvent {
    specialityPractitionerID?: number;
    practitionerId?: string;
    note?: string;
    locationId: string;
    bookOnline: boolean;
}

export interface RoomEvent extends SchedulerEvent {
    roomId?: number;
    locationId: string;
}

export interface BreakEvent extends SchedulerEvent {
    breakId: string;
    breakName: string;
    notes: string;
    practitionerId: string;
    specialityPractitionerId: number;
    type: string;
}

export interface AppointmentEvent extends SchedulerEvent {
    
}

export interface WaitListEvent {
    id?: string;
    parentBusinessId?: string,
    locationId?: string,
    patientId?: string;
    patientName?: string;
    practitionerId?: string;
    practitionerName?: string;
    serviceId?: string;
    serviceName?: string;
    firstAvailableDate: Date;   // - 15/10/2020
    availableFrom: Date;        // - 9:00AM
    availableUntil: Date;       // - 5:00PM
    availableDays?: string;      // - This will store as Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday
    keepInWaitListUntil: Date;  // - 15/11/2020
    isHighPriority: boolean;    // true/false
    notes?: string;    
    waitListDays?: Date[];
    display?: boolean;
}