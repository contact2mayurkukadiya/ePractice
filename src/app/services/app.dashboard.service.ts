import { Injectable } from "@angular/core";
import { DashboardModel } from '../models/app.dashboard.model';
import { BaseService } from './app.base.service';


@Injectable()
export class DashboardService extends BaseService {
    getDashboardCheckListView() {
        return this.http.get<DashboardModel>(this.environmentSettings.apiBaseUrl + "/GetDashboardCheckListView");
    }

    createDashboardCheckList(dashboard: DashboardModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/CreateDashboardCheckList", dashboard, { responseType: 'text' as 'json' });
    }

    updateDashboardCheckList(dashboard: DashboardModel) {
        return this.http.post<any>(this.environmentSettings.apiBaseUrl + "/UpdateDashboardCheckList", dashboard, { responseType: 'text' as 'json' } );
    }

}