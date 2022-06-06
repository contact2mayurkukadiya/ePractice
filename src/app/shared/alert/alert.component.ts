import { Component, OnInit, Input } from '@angular/core';
import { MessageType } from 'src/app/models/app.misc';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() message: string;
  @Input() type: MessageType;

  messageType = MessageType;

  constructor() { }

  ngOnInit() {
  }

}
