export class ContactModel {
  id: string;
  parentBusinessId: string;
  organisationName: string;
  departmentName: string;
  contactType: number;
  categoryId: number;
  titleId: string;
  name: string;
  firstName: string;
  lastName: string;
  providerNo: string;
  referenceNo: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postCode: string;
  workPhone: string;
  mobile: string;
  fax: string;
  emailId: string;
  website: string;
  notes: string;
  status: boolean;
  isAllowAllLocation: boolean;
  locationName: any;
  specialtyName: any;
  contactLocation: ContactLocationModel[];
  contactSpecialty: ContactSpecialtyModel[];
}

export class ContactLocationModel {
  contactId?: string;
  locationId: string;
  isStatus?: boolean;
}

export class ContactSpecialtyModel {
  contactId?: string;
  locationId: string;
  specialtyId: string;
  isStatus?: boolean;
}
