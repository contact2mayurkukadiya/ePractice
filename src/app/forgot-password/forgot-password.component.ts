import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AuthService } from '../services/app.authenication.service';
import { ForgotPasswordModel } from '../models/app.user.model';
import { AppService } from '../app.service';
import { AppState } from '../app.state';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotModel: ForgotPasswordModel = new ForgotPasswordModel();

  userid: string;
  username: string;
  forgotSubmitted: boolean = false;
  submitting: boolean = false;
  errorMessage: string;

  constructor(private authService: AuthService, 
              private appState: AppState) { 

  }
  
  ngOnInit() {
    this.appState.contrastBackgroundSubject.next(true);
  }

  ngOnDestroy() {
    this.appState.contrastBackgroundSubject.next(false);
  }

  forgotPassword(event: Event) {
    this.submitting = true;
    this.errorMessage = null;
    event.preventDefault();
    
    this.authService.forgotPassword(this.forgotModel).subscribe(data => {
      this.forgotSubmitted = true;
      this.submitting = false;
    }, error => {
      console.log(error);
      this.errorMessage = error.error.text;
      this.forgotSubmitted = false;
      this.submitting = false;
    });
  }
}
