import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppService } from '../app.service';
import { Register } from '../models/app.user.model';
import { AuthService } from '../services/app.authenication.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MessageType } from '../models/app.misc';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {
  registerModel: Register = new Register();
  enableRegister: boolean = true;
  registered: boolean = false;
  message:string;
  messageType: MessageType;
  createButtonText: string = "Register";

  registerForm = new FormGroup({
    firstname: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required),
    username: new FormControl("", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    businessname: new FormControl("", Validators.required),
    isTermOfService: new FormControl(false, Validators.requiredTrue),
    recaptcha: new FormControl("", Validators.required)
  });

  recaptchaKey: string;

  constructor(private appService: AppService,
              private authService: AuthService
              ) { 
  }

  ngOnInit() {
    this.recaptchaKey = environment.recaptchaKey;
  }

  register($event: Event) {
    this.enableRegister = false;
    $event.preventDefault();
    this.message = null;
    this.messageType = MessageType.error;

    if(!this.registerForm.invalid) {
      this.createButtonText = "Registering...";
      this.authService.register(this.registerForm.value).subscribe(data => {
        this.registered = true;
        this.createButtonText = "Registered";
        this.message = "Registered successfully. A message has been sent to the email you've provided. Please check your inbox or junk folder."
        this.messageType = MessageType.success;
      }, error => {
        this.enableRegister = true;
        this.createButtonText = "Register";
        let e = JSON.parse(error.error);
        this.message = e.message;
      });
    }
  }
}
