export class BaseSettingModel {
    isStatus: boolean;
    isAllowAllLocation: boolean;
    locationName: string;
}

export class BaseLocationModel {
    locationId: string;
    locationName?: string;
    isStatus?: boolean;
}

// ======== Specialty ========
export class SpecialtyModel extends BaseSettingModel {
    id: string;
    specialtyName: string;
    isEnableOnlineBooking: boolean;
    specialtyLocation: SpecialtyLocationModel[];
}

export class SpecialtyLocationModel extends BaseLocationModel {
    specialtyId?: string;
}

// ======== Tax ========
export class TaxModel extends BaseSettingModel {
    id: string;
    taxType: string;
    taxRate: number;
    taxLocation: TaxLocationModel[];
}

export class TaxLocationModel extends BaseLocationModel {
    taxId?: string;
}

// ======== Concession ========
export class ConcessionModel extends BaseSettingModel {
    id: string;
    concessionType: string;
    concessionLocation: CocessionLocation[];
}

export class CocessionLocation extends BaseLocationModel {
    concessionId?: string;
}

// ======== Missed Reason ========
export class MissedReasonModel extends BaseSettingModel {
    id: string;
    missedName: string;
    missedReasonLocation: MissedReasonLocation[];
}

export class MissedReasonLocation extends BaseLocationModel {
    missedReasonId?: string;
}

// ======== Payment Type ========
export class PaymentTypeModel extends BaseSettingModel {
    id: string;
    paymentType: string;
    paymentLocation: PaymentTypeocation[];
}

export class PaymentTypeocation extends BaseLocationModel {
    paymentId?: string;
}

// ======== Treatment Room ========
export class TreatmentRoomModel extends BaseSettingModel {
    id: string;
    treatmentType: string;
    treatmentLocation: TreatmentRoomLocation[];
    selected: boolean;
}

export class TreatmentRoomLocation extends BaseLocationModel {
    treatmentId?: string;
}

// ======== Cancel Reason ========
export class CancelReasonModel extends BaseSettingModel {
    id: string;
    cancelName: string;
    cancelReasonLocation: CancelReasonLocation[];
}

export class CancelReasonLocation extends BaseLocationModel {
    cancelReasonId?: string;
}

// ======== Marketing Source ========
export class MarketingSourceModel extends BaseSettingModel {
    id: string;
    marketingName: string;
    marketingSourceLocation: MarketingSourceLocation[];
}

export class MarketingSourceLocation extends BaseLocationModel {
    marketingSourceId?: string;
}

// ======== Appointment Type ========
export class AppointmentTypeModel extends BaseSettingModel {
    id: string;
    appointmentType: string;
    color: string;
    appointmentTypesLocation: AppointmentTypeLocation[];
}

export class AppointmentTypeLocation extends BaseLocationModel {
    appointmentTypeId?: string;
}

// ======== Discount Type ========
export class DiscountTypeModel extends BaseSettingModel {
    id: string;
    discountName: string;
    discountType: string;
    color: string;
    isModifiable: boolean;
    discountLocation: DiscountTypeLocation[];
}

export class DiscountTypeLocation extends BaseLocationModel {
    discountId?: string;
}

// ======== Document Type ========
export class DocumentTypeModel extends BaseSettingModel {
    id: string;
    folderName: string;
    documentTypesLocation: DocumentTypeLocation[];
}

export class DocumentTypeLocation extends BaseLocationModel {
    documentTypeId?: string;
}


// ======== BusinessTemplate ========
export class BusinessTemplateModel extends BaseSettingModel {
    id: string;
    parentBusinessId: string;
    name: string;
    type: number;
    description: string
    subject: string
    body: string
    status: boolean
    modifiedBy: string;
    modifiedDate: string;
    businessTemplateLocations: BusinessTemplateLocations[];
}

export class BusinessTemplateLocations extends BaseLocationModel {
    locationId: string;
    locationName: string;
}