export class StaffModel {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    middleName: string;
    nickName: string;
    position: string;
    emailId: string;
    qualification: string;
    phone: string;
    mobile: string;
    address: string;
    country: string;
    state: string;
    city: string;
    photo: string;
    postCode: string;
    timeZone: string;
    dob: Date;
    gender: string;
    signature: string;
    emailSignature: string;
    biography: string;
    notes: string;
    isStatus: boolean;
    isTermOfServicee: boolean;
    isTreatmentPrivateNote: boolean;
    isTreatmentSharedNote: boolean;
    isPractitionerCalendar: boolean;
    isDoubleBooking: boolean;
    isPatientOnlineBooking: boolean;
    isCancelledAppointment: boolean;
    isOnlineBooking: boolean;
    practitionerCalendarColor: string;
    userLocationRoles: UserLocationRoleModel[];
    userLocationRolesPractitoner: UserLocationRolesPractitonerModel[];
    userPractitonerAccess: PractitionerLocationModel[];
    isAccess: boolean;
}

export class UserLocationRoleModel {
    locationId: string;
    roleId: string;
    locationName: string;
    roleName: string
}

export class UserLocationRolesPractitonerModel {
    locationId: string;
    specialityId: string;
    roleId: string;
    specialityName: string;
    providerNumber: string;
    otherID: string
}

export class PractitionerLocationModel {
    locationId: string;
    practitonerId: string;
    name: string;
}

export class PractitionerModel {
    id: string;
    firstName: string;
    lastName: string;
    locationId: string;
    specialtyId: string;
    specialty: string;
    fullName: string;
    initials: string;
    photo: string;
    selected?: boolean;
    practitionerSpecialtyId: string;
}


export class PractitionerSpecialityModel {
    color: string;
    photo: string;
    practitionerId: string; 
    practitionerName: string;
    specialityId: string;
    specialityName: string;
    specialityPractitionerId: number;
    type: string;

    practitionerspecialitiesNames: PractitionerspecialitiesName[];
    practitionerspecialitiesNamesString: string;
    
    initials: string;
    selected?: boolean;
}

export class PractitionerspecialitiesName {
    specialityName: string;
    specialityPractitionerId: number;
}

export class GroupSpecialityPractitonerModel {
    specialityId: string;
    specialityName: string;
    practitioners: any[];
    expand: boolean;
}

export class SpecialityPractitonerModel {
    practitionerId: string;
    practitionerName: string;
    photo: string;   
}
