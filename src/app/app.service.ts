import { Injectable, OnInit, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AppState } from './app.state';

@Injectable()
export class AppService implements OnInit, AfterViewInit {
    constructor(private appState: AppState) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
}
