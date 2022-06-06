import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/app.authenication.service';
import { FinaliseModel } from '../models/app.user.model';
import { checkPasswordsValidator } from '../shared/validation';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {
  activationSubmitted: boolean = false;
  submitting: boolean = false;
  errorMessage: string;

  activationForm = new FormGroup({
    password: new FormControl("", {
      validators: Validators.required,
      updateOn: 'blur'
    }),
    confirmPassword: new FormControl("", {
      validators: Validators.required,
      updateOn: 'blur'
    }),
  }, { validators: checkPasswordsValidator });

  get confirmPassword() {
    return this.activationForm.get('confirmPassword');
  }

  userid: string;
  token: string;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    let params = this.route.snapshot.queryParams;
    this.token = params['token'];
    this.userid = params['userid'];
    // Get Method: Check if the activation link is valid? --NEW API
    // isValid: false, message: Your link has been expired? 
    // isValid: true
  }

  accountSetup(event: Event) {
    this.submitting = true;
    this.errorMessage = null;
    event.preventDefault();

    if(!this.activationForm.invalid) {
  
      let finalise: FinaliseModel = new FinaliseModel();
      finalise.userid = this.userid;
      finalise.password = this.activationForm.get('password').value;
      
      if(this.token && this.userid) {
        this.authService.confirmEmail(this.token,  this.userid).subscribe(d => {
          this.authService.createPassword(finalise).subscribe(data => {
            this.activationSubmitted = true;
            this.submitting = false;
          }, error => {
            this.errorMessage = error.error.text;
            this.activationSubmitted = false;
            this.submitting = false;
          });

        }, error => {
          this.errorMessage = error.error.text;
          this.activationSubmitted = false;
          this.submitting = false;
        });
      }
    }
  }
}
