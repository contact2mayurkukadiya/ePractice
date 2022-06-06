import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-no-data',
  templateUrl: './grid-no-data.component.html',
  styleUrls: ['./grid-no-data.component.css'],
})
export class GridNoDataComponent implements OnInit {
  @Input() description: string;
  @Input() title: string;
  @Input() routeName: string;
  @Input() routeLink: string;
  constructor(private router: Router) {}

  ngOnInit() {}
}
