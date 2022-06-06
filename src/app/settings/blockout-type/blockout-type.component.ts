import { Component, OnInit } from '@angular/core';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';

@Component({
  selector: 'app-blockout-type',
  templateUrl: './blockout-type.component.html',
  styleUrls: ['./blockout-type.component.css']
})
export class BlockoutTypeComponent extends BaseGridComponent implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit() {
  }
}
