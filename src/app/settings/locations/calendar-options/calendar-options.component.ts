import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MiscService } from 'src/app/services/app.misc.service';

@Component({
  selector: 'app-calendar-options',
  templateUrl: './calendar-options.component.html',
  styleUrls: ['./calendar-options.component.css']
})
export class CalendarOptionsComponent implements OnInit {
  @Input() formGroup: FormGroup;
  
  apperance: string = "outline";

  public steps: any = { hour: 0, minute: 15, second: 0 };
  constructor(private miscService: MiscService
  ) { 

  }
  
  timezone: any[];
  
  ngOnInit() {
    let country = this.formGroup.get("country").value;
    if(country) {
      this.miscService.getTimezone(country).subscribe(tz => {
        this.timezone = tz;
      });
    }
  }

}
