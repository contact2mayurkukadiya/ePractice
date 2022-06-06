import { Type } from "@angular/core";

export class PatientModel {
  id: string;
  parentBusinessId: string;
  patientPhoto: string;
  patientStatus: number;
  patientId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  preferredName: string;
  locationId: string;
  title: number;
  gender: string;
  dob: string;
  firstVisitDate: string;
  position: number;
  status: number;
  nationality: string;
  language: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postCode: string;
  homePhone: string;
  workPhone: string;
  mobile: string;
  email: string;
  relationship: number;
  emergencyContactName: string;
  emergencyContactHomePhone: string;
  emergencyContactWorkPhone: string;
  emergencyContactMobile: string;
  emergencyContactEmail: string;
  patientClassification: number;
  medicalCondition: string;
  allergy: string;
  medication: string;
  occupation: number;
  designation: string;
  employer: number;
  marketingSource: string;
  concession: string;
  invoiceNotes: string;
  creditCardType: number;
  cardHolderName: string;
  creditCardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: number;
  accountName: string;
  bsbCode: number;
  accountNumber: string;
  patientLocation: PatientLocationModel[];
  patientHealthFund: PatientHealthFundModel[];
  patientCommunication: PatientCommunicationModel[];
  locationName: any;
  practitionerId: any;
  isStatus?: boolean;
}

export class PatientLocationModel {
  patientId?: string;
  locationId: string;
  isStatus?: boolean;
}

export class PatientHealthFundModel {
  patientId?: string;
  healthFundId: number;
  membershipNumber: string;
  irnUpi: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
  claimantFirstName: string;
  claimantLastName: string;
  claimantDOB: string;
  claimantMedicareNo: string;
  claimantIrnUpi: number;
  isStatus?: boolean;
}

export class PatientCommunicationModel {
  patientId?: string;
  communicationType: string;
  reminder: boolean;
  marketing: boolean;
}

export class PatientTab {
  public title: string;
  public active: boolean;
  public component: Type<any>;
  public addUrl: string;

  constructor(component: Type<any>, title: string, active: boolean = false) {
    this.component = component;
    this.title = title;
    this.active = active;
  }
}

export class PatientPersonalizeModel {
  id: string;
  locationId: string;
  personalizeType: number;
  prefix: string;
  suffix: string;
  startingNumber: string;
}

export class MergePatientModel {
  id: string;
  patientId: string;
  name: string;
  image: string;
  gender: string;
  mobile: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  totalAppointments: string;
  totalOutstanding: string;
}

export class DocumentListModel {
  id: string;
  patientId: string;
  locationId: string;
  documentName: string;
  uploadedDate: string;
  documentTypesId: string;
  caseName: string;
  note: string;
  fileTypes: string;
  size: string;
  streamedFileContent: string;
  lockUnlock: string;
}
export class PatientDocumentUpdateModel {
  documentId: string;
  patientId: string;
  locationId: string;
  documentName: string;
  uploadedDate: string;
  documentTypesId: string;
  caseName: string;
  note: string;
}

export class MergePatientsModel {
  originalId: string;
  duplicateId: string;
}
export class PatientDocumentUpdateLockModel {
  id: string;
  patientId: string;
  lockUnlock: number;
}
export class PractitonerLocationSpecialityModel {
  locationId: string;
  specialityId: string;
  locationName: string;
  specialityName: string;
  templateNameList: TemplateNameList[];
}

export class PatientTreatmentNotesModel {
  eligibleTreatment: EligibleTreatmentNoteTemplatesModel[];
  patientTreatmentNote: PatientTreatmentNoteModel[];
}

export class EligibleTreatmentNoteTemplatesModel {
  id: string;
  treatmentName: string;
  treatmentCaseStatus: number;
  specialityName: string;
  specialityId: string;
  locationId: string;
  locationName: string;
}

export class PatientTreatmentNoteModel {
  id: string;
  treatmentName: string;
  treatmentCaseStatus: number;
  modifiedDate: string;
  practitioner: string;
  cases: string;
}

export class TemplateNameList {
  treatmentId: string;
  treatmentName: string;
}