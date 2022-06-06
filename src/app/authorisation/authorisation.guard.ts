import { Inject, Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as decode from 'jwt-decode';
import { AppService } from '../app.service';
import { AppState } from '../app.state';
import { UserProfile } from '../models/app.user.model';

@Injectable()
export class SecurityGuard implements CanActivate {
    loginMessageExpired: string = "Your session has expired. Please click the login button to log back in.";

    constructor(
        private appState: AppState,
        private router: Router,
        private appService: AppService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let token = localStorage.getItem('token');
        
        if (token === null) {
            this.appState.setUserProfileSubject(null);
            this.router.navigate(['login']);
            return false;
        }

        let tokenPayload = decode(token);

        if (!tokenPayload) {
            this.appState.set("loginMessage", this.loginMessageExpired);
            this.appState.setUserProfileSubject(null);
            this.router.navigate(['login']);
            return false;
        }

        if (this.isJwtExpired(tokenPayload)) {
            this.appState.set("loginMessage", this.loginMessageExpired);
            this.appState.setUserProfileSubject(null);
            this.router.navigate(['login']);
            return false;

        } else {
            let profile:UserProfile  = new UserProfile();
            profile.firstName = tokenPayload.FirstName;
            profile.lastName = tokenPayload.LastName;
            profile.parentBusinessId = tokenPayload.ParentBusinessId;
            profile.userName = tokenPayload.UserName;
            this.appState.setUserProfileSubject(profile);
            return true;
        }

        
    }

    private validateNavigation(state: RouterStateSnapshot) {
        
    }

    isJwtExpired(jwt: any) {
        var current_time = Date.now() / 1000;
        return jwt.exp < current_time
    }
}