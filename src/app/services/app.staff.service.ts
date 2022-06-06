import { Injectable } from "@angular/core";
import { BaseService } from './app.base.service';
import { StaffModel, PractitionerModel, PractitionerSpecialityModel, GroupSpecialityPractitonerModel } from '../models/app.staff.model';


@Injectable()
export class StaffService extends BaseService {
    
    addStaff(staff: StaffModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/AddStaff", staff, { responseType: 'text' as 'json' });
    }

    updateStaff(staff: StaffModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateStaff", staff, { responseType: 'text' as 'json' });
    }

    getStaffById(id: string) {
        return this.http.get<StaffModel>(this.environmentSettings.apiBaseUrl + `/GetStaffById/${id}`);
    }

    getStaffs() {
        return this.http.get<StaffModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllStaffs");
    }

    getPractitioners() {
        return this.http.get<PractitionerModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllPractitoners");        
    }

    getAllSpecialityPractitoners() {
        return this.http.get<PractitionerSpecialityModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllSpecialityPractitoners");        
    }

    getAllGroupSpecialityPractitoners() {
        return this.http.get<GroupSpecialityPractitonerModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllGroupSpecialityPractitoners");        
    }

    getAllPractitonersByLocationId​(Id: string) {
        return this.http.get<PractitionerSpecialityModel[]>(this.environmentSettings.apiBaseUrl + `/GetAllPractitonersByLocationId/${Id}`);        
    }

    getAllSpecialityPractitonersByLocId(id: string) {
        return this.http.get<PractitionerSpecialityModel[]>(this.environmentSettings.apiBaseUrl + `/GetAllSpecialityPractitonersByLocId/${id}`);            
    }

    getAllGroupSpecialityPractitonersByLocId(id: string) {
        return this.http.get<GroupSpecialityPractitonerModel[]>(this.environmentSettings.apiBaseUrl + `/GetAllGroupSpecialityPractitonersByLocId/${id}`);
    }

}