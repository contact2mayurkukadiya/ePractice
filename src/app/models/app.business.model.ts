
export interface BusinessModel {
    accountNumber: string;
    address1: string;
    address2: string;
    bankName: string;
    bsbNumber: string;
    businessLogo: string;
    businessName: string;
    businessRegistrationName: string;
    businessRegistrationNo: string;
    city: string;
    contactPerson: string;
    country: string;
    emailId: string;
    fax: string;
    invoiceTerms: string;
    isDefault: boolean;
    mobile: string;
    notes: string;
    phone: string;
    postCode: string;
    startTime: Date;
    endTime: Date;
    state: string;
    status: boolean;
    timeZone: string;
    website: string;
    
    id?: string;
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
}

export interface BusinessFormModel {
    accountNumber: string;
    address1: string;
    address2: string;
    bankName: string;
    bsbNumber: string;
    businessLogo: string;
    businessName: string;
    businessRegistrationName: string;
    businessRegistrationNo: string;
    city: string;
    contactPerson: string;
    country: string;
    emailId: string;
    fax: string;
    invoiceTerms: string;
    isDefault: boolean;
    mobile: string;
    notes: string;
    phone: string;
    postCode: string;
    startTime: Date;
    endTime: Date;
    state: string;
    status: string;
    timeZone: string;
    website: string;

    timeString?: string;
}