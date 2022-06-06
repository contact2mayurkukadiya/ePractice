export class ClassModel {
  id: string;
  parentBusinessId: string;
  classLogo: string;
  colour: string;
  classCode: string;
  medicareCode: string;
  dvaCode: string;
  className: string;
  description: string;
  categoryId: number;
  duration: number;
  maximumParticipants: number;
  standardPrice: number;
  taxTypeId: string;
  taxOptionId: number;
  classLocation: ClassLocationModel[];
  classSpecialty: ClassSpecialtyModel[];
  classPractitioner: ClassPractitionerModel[];
  classRelatedProduct: ClassRelatedProductModel[];
  classConcession: ClassConcessionModel[];
  status: string;
  onlineBooking: string;
  locationName: any;
  specialtyName: any;
  practitionerName: any;
  productName: any;
  isAllowAllLocation: boolean;
}

export class ClassLocationModel {
  classId?: string;
  locationId: string;
  isStatus?: boolean;
}

export class ClassSpecialtyModel {
  classId?: string;
  locationId: string;
  specialtyId: string;
  isStatus?: boolean;
}

export class ClassPractitionerModel {
  classId?: string;
  locationId: string;
  specialtyId: string;
  practitionerId: string;
  isStatus?: boolean;
}

export class ClassRelatedProductModel {
  classId?: string;
  productId: string;
  isStatus?: boolean;
}

export class ClassConcessionModel {
  classId?: string;
  locationId: string;
  concessionId: string;
  concessionAmount: number;
  concessionType: string;
  locationName: string;
  isStatus?: boolean;
}
