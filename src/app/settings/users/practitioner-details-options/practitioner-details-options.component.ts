import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from 'src/app/services/app.settings.service';

@Component({
  selector: 'app-practitioner-details-options',
  templateUrl: './practitioner-details-options.component.html',
  styleUrls: ['./practitioner-details-options.component.css']
})
export class PractitionerDetailsOptionsComponent implements OnInit {
  @Input() formGroup: FormGroup;
  apperance: string = "outline";
  specialties: any[];

  constructor(private settingService: SettingsService) { }

  ngOnInit() {
    this.settingService.getAllSpecialties().subscribe(s => {
      this.specialties = s.filter(sp => sp.isStatus);
    });
  }
}
