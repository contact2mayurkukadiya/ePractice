import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseService {
    public environmentSettings: any;

    constructor(public http: HttpClient) {
        this.environmentSettings = environment;
    }
} 