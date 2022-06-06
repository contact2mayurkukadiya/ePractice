import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.css']
})
export class EmailtemplateComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<EmailtemplateComponent>) { }

  ngOnInit() {
  }
  close() {
    this.matDialogRef.close()
  }
}
