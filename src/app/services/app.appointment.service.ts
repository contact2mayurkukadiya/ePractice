
import { Injectable } from "@angular/core";
import { BreakEvent, ScheduleEvent, WaitListEvent } from '../models/app.appointment.model';
import { BaseService } from './app.base.service';

@Injectable()
export class AppointmentService extends BaseService {
    // Schedule

    getAllPractitionerSchedulesDetails() {
        return this.http.get<ScheduleEvent[]>(this.environmentSettings.apiBaseUrl + "/GetAllPractitionerSchedulesDetails");
    }

    getPractitionerSchedulesDetails(scheduleDetail: any) {
        return this.http.get<any[]>(this.environmentSettings.apiBaseUrl + `/GetPractitionerSchedulesDetails?scheduleId=${scheduleDetail.scheduleId}&practitonerId=${scheduleDetail.practitonerId}&locationid=${scheduleDetail.locationid}`);
    }

    createSchedule(scheduleDetails: ScheduleEvent) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreatePractitionerSchedule", scheduleDetails, { responseType: 'text' as 'json' });
    }

    updateSchedule(scheduleDetails: ScheduleEvent) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdatePractitionerSchedule", scheduleDetails, { responseType: 'text' as 'json' });
    }

    deleteSchedule(id: string) {
        return this.http.delete<any>(this.environmentSettings.apiBaseUrl + `/RemovePractitionerSchedule/${id}`);
    }

    // Break

    getAllPractitionerBreakDetails() {
        return this.http.get<BreakEvent[]>(this.environmentSettings.apiBaseUrl + "/GetAllPractitionerBreakDetails");
    }

    createBreak(breakEvent: BreakEvent) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreatePractitionerBreak", breakEvent, { responseType: 'text' as 'json' });
    }

    updateBreak(breakEvent: BreakEvent) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdatePractitionerBreak", breakEvent, { responseType: 'text' as 'json' });
    }

    deleteBreak(id: string) {
        return this.http.delete<any>(this.environmentSettings.apiBaseUrl + `/RemovePractitionerBreak/${id}`);
    }

    //WaitList
    getAllPractitionerWaitListDetails(locationid: string) {
        return this.http.get<WaitListEvent[]>(this.environmentSettings.apiBaseUrl + `/GetAllPractitionerWaitListDetails/${locationid}`);
    }
    
    createPractitionerWaitList(waitlist: WaitListEvent) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreatePractitionerWaitList", waitlist, { responseType: 'text' as 'json' });
    }

    updatePractitionerWaitList(waitlist: WaitListEvent) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdatePractitionerWaitList", waitlist, { responseType: 'text' as 'json' });
    }

    removePractitionerWaitList(id: string) {
        return this.http.delete<any>(this.environmentSettings.apiBaseUrl + `/RemoveWaitListDetailsById/${id}`);        
    }

    getAllPractitionerWaitListDetailsById(id: string, practitonerId: string, locationId: string) {
        return this.http.get<WaitListEvent>(this.environmentSettings.apiBaseUrl + `/GetAllPractitionerWaitListDetailsById?waitlistid=${id}&practitonerId=${practitonerId}&locationid=${locationId}`);
    }
    
    getAllPractitionerEventDetails(id: string) {
        return this.http.get<any>(this.environmentSettings.apiBaseUrl + `/GetAllPractitionerEventDetails/${id}`);
    }

}