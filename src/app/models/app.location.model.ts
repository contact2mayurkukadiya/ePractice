export interface LocationModel {
    id: string;
    locationName: string;
    locationLogo: string;
    emailId: string;
    locationRegistrationName: string;
    locationRegistrationNo: string;
    contactPerson: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    postCode: string;
    phone: string;
    mobile: string;
    fax: string;
    website: string;
    status: boolean;
    timeZone: string;
    startTime: string;
    endTime: string;
    timeSlot: string;
    timeSlotSize: string;
    calendarColor: string;
    isDoubleBooking: boolean;
    isPatientOnlineBooking: boolean;
    bankName: string;
    bsbNumber: string;
    accountNumber: string;
    InvoiceTerms: string;
    notes: string;
}

export interface LocationGridModel {
    id: string;
    locationName: string;
    status: boolean;
    timeZone: string;
    startTime: Date;
    endTime: Date;
    contactPerson: string;
    calendarColor: string;
    timeString: string;
    isStatus: boolean;
}

export interface LocationSelectionModel {
    id: string;
    locationName: string;
    status: boolean;
}