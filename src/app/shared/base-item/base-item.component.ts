import { Component, OnInit, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { MessageType } from 'src/app/models/app.misc';
import { LocationGridModel } from 'src/app/models/app.location.model';

@Component({
  selector: 'app-base-item',
  template: ``,
  styleUrls: ['./base-item.component.css']
})

@Injectable()
export class BaseItemComponent implements OnInit {
  color: any;
  message: string;
  type: MessageType;
  submitting: boolean = false;
  apperance: string = "outline";
  addItem: boolean = true;
  public locationList: LocationGridModel[];
  itemid: string;

  constructor(public location: Location) { }

  ngOnInit() {
    
  }

  displaySuccessMessage(message: string) {
    this.message = message;
    this.type = MessageType.success;
  }

  displayErrorMessage(message: string) {
    this.message = message;
    this.type = MessageType.error;
  }

  displayWarningMessage(message: string) {
    this.message = message;
    this.type = MessageType.warning;
  }

  displayInfoMessage(message: string) {
    this.message = message;
    this.type = MessageType.info;
  }

  cancel() {
    this.location.back();
  }
}
