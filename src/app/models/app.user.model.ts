export interface User {
    username: string;
    password: string;
}


export class UserProfile {
    userName: string;
    firstName: string;
    lastName: string;
    parentBusinessId: string;
    id: string;
}

export class Register {
    firstName: string;
    lastName: string;
    username: string;
    businessName: string;
    country: string;
    timezone: string;
    isTermOfService: boolean;
}

export class ForgotPasswordModel {
    emailid: string;
    username: string;
    password: string;
}

export class LoginModel {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
}

export class LoginSubmitModel {
    userid: string;
    password: string;
}

export class FinaliseModel {
    userid: string;
    password: string;
}

