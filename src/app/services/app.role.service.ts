import { Injectable } from "@angular/core";
import { BaseService } from './app.base.service';
import { PermissionRoleModel, RoleModel, LocationRoleAndPermissionModel } from '../models/app.role.model';

@Injectable()
export class RoleService extends BaseService {
    getAllRoles() {
        return this.http.get<RoleModel[]>(this.environmentSettings.apiBaseUrl + "/GetAllRoles");
    }

    getRoleById(id: string) {
        return this.http.get<any>(this.environmentSettings.apiBaseUrl + `/GetRolesById/${id}`);
    }

    getRoleAndPermissions(id: string) {
        return this.http.get<PermissionRoleModel[]>(this.environmentSettings.apiBaseUrl + `/GetAppRoleAndPermissionModulesByBusinessId/${id}`);
    }

    getRoleAndPermissionsByUserLocation(id: string) {
        return this.http.get<LocationRoleAndPermissionModel[]>(this.environmentSettings.apiBaseUrl + `/GetAppRoleAndPermissionModulesByUserLocationId/${id}`);
    }
}