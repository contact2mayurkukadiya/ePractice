import { Component, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { MatDrawer } from '@angular/material';
import { onMainContentChange } from './animations/animations';
import { AppState } from './app.state';
import { AuthService } from './services/app.authenication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange]
})
export class AppComponent {
  @ViewChild("drawer", { read: true, static: true }) drawer : MatDrawer;
  public onSideNavChange: boolean;
  title = 'kavaniiUI';
  
  constructor(public appService: AppService,
              public appState: AppState,
              private authService: AuthService,
              private router: Router
    ) {

  }

  closeDrawer() {
    this.drawer.opened = false;
  }

  logout() {
    this.appState.resetState();
    this.authService.logout();
    this.router.navigate(["login"]);
  }
}
