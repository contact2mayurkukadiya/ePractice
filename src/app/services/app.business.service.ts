import { Injectable } from "@angular/core";
import { BusinessModel, BusinessFormModel  } from '../models/app.business.model';
import { LocationGridModel, LocationModel, LocationSelectionModel } from '../models/app.location.model';
import { BaseService } from './app.base.service';

@Injectable()
export class BusinessService extends BaseService {
    getAllBusiness() {
        return this.http.get<BusinessModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllBusiness");
    }    

    getLocation(locationId: string) {
        return this.http.get<any>(this.environmentSettings.apiBaseUrl + `/GetBusinessLocationById/${locationId}`);
    }

    addLocation(locationDetails: any) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateLocation", locationDetails);
    }

    updateLocation(locationDetails: any) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateLocation", locationDetails);
    }

    getParentBusiness(id: string) {
        return this.http.get<BusinessFormModel>(this.environmentSettings.apiBaseUrl + `/GetParentBusinessById/${id}`);
    }

    updateBusiness(businessModel: BusinessModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateBusiness", businessModel, { responseType: 'text' as 'json' });
    }

    getLocationsByBusiness(parentBusinessId: string) {
        return this.http.get<LocationGridModel[]>(this.environmentSettings.apiBaseUrl + `/GetAllLocationsByParentBusinessId/${parentBusinessId}`);
    }

    getLocationsForCurrentUser() {
        return this.http.get<LocationSelectionModel[]>(this.environmentSettings.apiBaseUrl + "/GetLocationsByLoginUser");
    }
}