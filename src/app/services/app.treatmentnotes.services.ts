import { Injectable } from '@angular/core';
import { BaseService } from './app.base.service';
import { TreatmentNotesModel } from '../models/app.treatmentnotes.model';

@Injectable()
export class TreatmentNotesService extends BaseService {
  messageConfirmation: string;
  createTreatmentNotesTemplate(treatmentNotesModel: TreatmentNotesModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/createtreatmentnotestemplate',
      treatmentNotesModel
    );
  }

  GetTreatmentNotesTemplateById(treatmentNotesTemplateId: string) {
    return this.http.get<TreatmentNotesModel>(
      this.environmentSettings.apiBaseUrl +
        `/gettreatmentnotestemplatebyid?treatmentNotesTemplateId=${treatmentNotesTemplateId}`
    );
  }

  updateTreatmentNotesTemplate(treatmentNotesModel: TreatmentNotesModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updatetreatmentnotestemplate',
      treatmentNotesModel
    );
  }

  GetAllTreatmentNotesTemplate() {
    return this.http.get<TreatmentNotesModel[]>(
      this.environmentSettings.apiBaseUrl + '/getalltreatmentnotestemplates'
    );
  }
}
