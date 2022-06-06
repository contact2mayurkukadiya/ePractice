import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  MergePatientsModel,
  PatientModel,
  PatientPersonalizeModel,
  DocumentListModel,
  PatientDocumentUpdateLockModel,
  PatientDocumentUpdateModel,
  PractitonerLocationSpecialityModel,
  PatientTreatmentNotesModel,
} from '../models/app.patient.model';
import { BaseService } from './app.base.service';

@Injectable()
export class PatientService extends BaseService {
  sharedData: string;
  onSuccess = new BehaviorSubject<string>('');
  onSuccess1 = new BehaviorSubject<string>('');
  getAllPatients() {
    return this.http.get<any[]>(
      this.environmentSettings.apiBaseUrl + '/getallpatients'
    );
  }

  getAllPatientsByLocationId(locationId: string) {
    return this.http.get<PatientModel[]>(
      this.environmentSettings.apiBaseUrl +
      `/getallpatientsbylocationid?locationId=${locationId}`
    );
  }

  getPatientById(patientId: string) {
    return this.http.get<PatientModel>(
      this.environmentSettings.apiBaseUrl +
      `/getpatientbyid?patientId=${patientId}`
    );
  }

  createPatient(patientModel: PatientModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/createpatient',
      patientModel
    );
  }

  mergePatient(mergeModel: MergePatientsModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/mergepatient',
      mergeModel
    );
  }

  updatePatient(patientModel: PatientModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updatepatient',
      patientModel
    );
  }

  createPatientPersonalize(patientPersonalizeModel: PatientPersonalizeModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/createpatientpersonalize',
      patientPersonalizeModel
    );
  }

  updatePatientPersonalize(patientPersonalizeModel: PatientPersonalizeModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updatepatientpersonalize',
      patientPersonalizeModel
    );
  }

  getPersonalizeByTypeAndLocation(locationId: string, personalizeType: number) {
    return this.http.get<PatientPersonalizeModel>(
      this.environmentSettings.apiBaseUrl +
      `/getpersonalizebytypeandlocation?locationId=${locationId}&&personalizeType=${personalizeType}`
    );
  }

  getLastPatientIdByLocation(locationId: string) {
    return this.http.get<any>(
      this.environmentSettings.apiBaseUrl +
      `/getlastpatientidbylocation?locationId=${locationId}`
    );
  }

  getpatientdocuments(patientId: string) {
    return this.http.get<any>(
      this.environmentSettings.apiBaseUrl +
      `/getpatientdocuments?patientId=${patientId}`
    );
  }
  getpatientdocumentcontentbyid(patientId: string, documentId: string) {
    return this.http.get<any>(
      this.environmentSettings.apiBaseUrl +
      `/getpatientdocumentcontentbyid?patientId=${patientId}&documentId=${documentId}`
    );
  }
  deletepatientdocumentsbyid(patientId: string, documentId: string) {
    return this.http.get<DocumentListModel>(
      this.environmentSettings.apiBaseUrl +
      `/deletepatientdocumentsbyid?patientId=${patientId}&documentId=${documentId}`
    );
  }
  uploadpatientdocument(documentlistmodel: DocumentListModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/uploadpatientdocument',
      documentlistmodel
    );
  }
  updatepatientdocument(patientdocumentUpdateModel: PatientDocumentUpdateModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updatepatientdocument',
      patientdocumentUpdateModel
    );
  }
  updatepatientdocumentlockstatus(patientdocumentUpdateLockModel: PatientDocumentUpdateLockModel) {
    return this.http.post<any>(
      this.environmentSettings.apiBaseUrl + '/updatepatientdocumentlockstatus',
      patientdocumentUpdateLockModel
    );
  }


  openSuccess(msg) {
    this.onSuccess.next(msg);
  }
  openSuccess1(msg) {
    this.onSuccess1.next(msg);
  }
  getLocationSpecialityByPractitonerId(practitonerId: string) {
    return this.http.get<PractitonerLocationSpecialityModel[]>(
      this.environmentSettings.apiBaseUrl +
      `/GetLocationSpecialityByPractitonerId?practitonerId=${practitonerId}`
    );
  }

  getEligibleTreatmentNotes(locationId: string, patientId: string) {
    return this.http.get<PatientTreatmentNotesModel>(
      this.environmentSettings.apiBaseUrl +
      `/geteligibletreatmentnotes?locationId=${locationId}&practitonerId=${patientId}`
    );
  }
}
