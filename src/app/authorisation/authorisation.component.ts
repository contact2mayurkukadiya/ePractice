import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as decode from 'jwt-decode';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../app.state';
import { UserProfile } from '../models/app.user.model';

@Component({
  selector: 'app-authorisation',
  templateUrl: './authorisation.component.html',
  styleUrls: ['./authorisation.component.css']
})
export class AuthorisationComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
    private appState: AppState,
    private router: Router) { }
  
  permissionInterval: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      let token = params['token'];
      if (!token) {
        this.appState.set("errorMessage", "Invalid token.");
        this.router.navigate(['error']);
        return false;
      }

      let tokenPayload = null;
      try {
        tokenPayload = decode(token);
      } catch {
        this.appState.set("errorMessage", "Invalid token.");
        this.router.navigate(['error']);
        return false;
      }

      if (this.isJwtExpired(tokenPayload)) {

        localStorage.removeItem('token');
        this.appState.setUserProfileSubject(null);
        this.appState.set('errorMessage', "Invalid token.");
        this.router.navigate(['error']);

      } else {
        localStorage.setItem('token', token);
        let profile:UserProfile  = new UserProfile();
        profile.firstName = tokenPayload.FirstName;
        profile.lastName = tokenPayload.LastName;
        profile.parentBusinessId = tokenPayload.ParentBusinessId;
        profile.userName = tokenPayload.UserName;
        this.appState.setUserProfileSubject(profile);
        this.appState.loadLocationWhenReady();
        if(this.appState.userProfile) {
          this.populatePermission();
        }
      }
    });
  }

  ngOnDestroy() {
  }

  populatePermission() {
    if(this.appState.applicableForPermission()) {
      this.permissionInterval = setInterval(() => {
         if(this.appState.permissions) {
           clearInterval(this.permissionInterval);
           this.redirectToFirstAvailableModule();
         }
     }, 100);
   }
   else {
     this.redirectToDashboard();
   }
  }

  private redirectToFirstAvailableModule() {
    let firstAvailalbleModule = this.appState.permissions.find(p => p.isFullAccess || (p.appSubModules && p.appSubModules.length > 0));
    if(firstAvailalbleModule) {
      let topMenuUrl = this.appState.topMenus.find(p => p.name == firstAvailalbleModule.moduleName);
      let subMenuUrl = this.appState.menus.find(p => p.name == firstAvailalbleModule.moduleName);
      if(topMenuUrl) {
        this.router.navigate([topMenuUrl.link]);
      }
      if(subMenuUrl) {
        this.router.navigate([subMenuUrl.link]);
      }
    }
    else {
      this.router.navigate(['/accessDenied']);
    }
  }

  private redirectToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  isJwtExpired(jwt: any) {
    var current_time = Date.now() / 1000;
    return jwt.exp < current_time
  }
}
