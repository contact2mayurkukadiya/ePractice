import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.state';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TreatmentNotesService } from 'src/app/services/app.treatmentnotes.services';
import { TreatmentNotesModel } from 'src/app/models/app.treatmentnotes.model';
import { MatButtonToggleChange } from '@angular/material';

@Component({
  selector: 'app-treatment-notes-template',
  templateUrl: './treatment-notes-template.component.html',
  styleUrls: ['./treatment-notes-template.component.css'],
})
export class TreatmentNotesTemplateComponent
  extends BaseGridComponent
  implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  treatmentNotesTitle = '';
  treatmentNotesRouteLink = '';
  treatmentNotesRouteName = '';
  treatmentNotesDescription = '';
  isLoading: boolean;
  treatmentNotesShow: boolean;
  treatmentNotesTemplateAll: TreatmentNotesModel[] = [];
  treatmentNotesTemplates: TreatmentNotesModel[] = [];
  displaySuccessMessage: string;

  constructor(
    private router: Router,
    public appState: AppState,
    private treatmentNotesService: TreatmentNotesService
  ) {
    super();
  }

  ngOnInit() {
    this.populateLanding();
    this.displayMessage();
  }

  populateLanding() {
    this.blockUI.start();

    this.treatmentNotesService.GetAllTreatmentNotesTemplate().subscribe(
      (data) => {
        if (data.length === 0) {
          this.treatmentNotesTitle = 'You haven\'t added a Template';
          this.treatmentNotesRouteLink = '/settings/treatmentnotestemplate/add';
          this.treatmentNotesRouteName = 'Add Template';
          this.treatmentNotesDescription = 'Template is';
          this.treatmentNotesShow = false;
        } else {
          this.treatmentNotesShow = true;
          this.gridData = data;
        }
      }
    );
    this.isLoading = false;
    this.blockUI.stop();
  }

  treatmentNotesActiveChanged(event: MatButtonToggleChange) {
    if (event.value === 'active') {
      this.setActiveFilter();
    } else {
      this.setInactiveFilter();
    }
    this.loadItems();
  }

  setActive() {
    this.setActiveFilter();
  }

  setInactive() {
    this.setInactiveFilter();
  }

  displayMessage() {
    if (
      this.treatmentNotesService.messageConfirmation !== undefined &&
      this.treatmentNotesService.messageConfirmation !== ''
    ) {
      this.displaySuccessMessage = this.treatmentNotesService.messageConfirmation;
      this.treatmentNotesService.messageConfirmation = '';
    }

    setInterval(
      (a) => {
        this.displaySuccessMessage = '';
      },
      5000,
      []
    );
  }
}
