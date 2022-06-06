import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/app.authenication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageType } from '../models/app.misc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    userid: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  errorMessage: string;
  messageType = MessageType;
  signInMessage: string = "Log In";
  signing: boolean = false;

  constructor(private appService: AppService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  signIn($event) {
    this.signInMessage = "Logging in...";
    this.signing = true;
    this.errorMessage = null;
    $event.preventDefault();

    // let userid = this.loginForm.get("userid").value;
    // let password = this.loginForm.get("password").value;

    if(this.loginForm.valid) {
      // this.router.navigate(["authorisation", ""]);
      this.authService.login(this.loginForm.value).subscribe(result => {
        if(result) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("username", result.username);
          localStorage.setItem("firstName", result.firstName);
          localStorage.setItem("lastName", result.lastName);
          localStorage.setItem("token_id", result.id);
          this.router.navigate(["authorisation", result.token]);
          this.signInMessage = "Sign in";
          this.signing = false;
        }
      }, error => {
        console.log(error);
        console.log(error.message);
        this.errorMessage = error.error.message;
        this.signInMessage = "Log in";
        this.signing = false;
      });
    }
  }

}
