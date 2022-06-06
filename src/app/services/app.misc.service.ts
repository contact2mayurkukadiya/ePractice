import { Injectable } from '@angular/core';
import { BaseService } from './app.base.service';
import axios from 'axios';
@Injectable()
export class MiscService extends BaseService {
  getCountries() {
    return this.http.get<any[]>(
      this.environmentSettings.apiBaseUrl + '/GetCountries'
    );
  }

  getTimezone(country: string) {
    return this.http.get<any[]>(
      this.environmentSettings.apiBaseUrl + `/GetCountryTimeZone/${country}`
    );
  }

  getAddress(addrss: string) {
    const params = {
      access_key: '3c6a66ecf0e2def4ae7f9969950e4e42',
      query: addrss,
      country: 'AU',
    };

    return axios
      .get('https://api.positionstack.com/v1/forward', { params })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
