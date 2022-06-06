export class ServiceModel {
  id: string;
  parentBusinessId: string;
  serviceLogo: string;
  colour: string;
  serviceCode: string;
  medicareCode: string;
  dvaCode: string;
  serviceName: string;
  description: string;
  categoryId: number;
  duration: number;
  standardPrice: number;
  taxTypeId: string;
  taxOptionId: number;
  serviceLocation: ServiceLocationModel[];
  serviceSpecialty: ServiceSpecialtyModel[];
  servicePractitioner: ServicePractitionerModel[];
  serviceRelatedProduct: ServiceRelatedProductModel[];
  serviceTreatmentNotesTemplate: ServiceTreatmentNotesTemplateModel[];
  serviceConcession: ServiceConcessionModel[];
  status: string;
  onlineBooking: string;
  locationName: any;
  specialtyName: any;
  practitionerName: any;
  productName: any;
}

export class ServiceLocationModel {
  serviceId?: string;
  locationId: string;
  isStatus?: boolean;
}

export class ServiceSpecialtyModel {
  serviceId?: string;
  locationId: string;
  specialtyId: string;
  isStatus?: boolean;
}

export class ServicePractitionerModel {
  serviceId?: string;
  locationId: string;
  specialtyId: string;
  practitionerId: string;
  isStatus?: boolean;
}

export class ServiceRelatedProductModel {
  serviceId?: string;
  productId: string;
  isStatus?: boolean;
}

export class ServiceTreatmentNotesTemplateModel {
  serviceId?: string;
  productId: string;
  isStatus?: boolean;
}

export class ServiceConcessionModel {
  serviceId?: string;
  locationId: string;
  concessionId: string;
  concessionAmount: number;
  concessionType: string;
  locationName: string;
  isStatus?: boolean;
}
