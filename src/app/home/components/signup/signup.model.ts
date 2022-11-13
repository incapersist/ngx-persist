export class Signup {
    name: string;
    email: string;
    password: string;
    reason: string;
    country: string;
    signupRole: string;
    userRole: string;
    status: string;
}

export interface Country {
    id: number;
    name: string;
}

export interface PrimaryRole {
    id: number;
    name: string;
}
