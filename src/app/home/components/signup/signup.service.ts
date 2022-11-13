import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestServiceBase } from 'src/app/pages/shared/base-classes/RequestServiceBase';
import { Signup, Country, PrimaryRole } from './signup.model';

@Injectable({
  providedIn: 'root'
})
export class SignupService extends RequestServiceBase {

    constructor (protected http: HttpClient) {
        super(http);
    }

    getCountries(): Observable<Country[]> {
        const url = `${environment.api.baseUrl}/signup/countries`;
        return this.get<Country[]>(url);
    }

    getPrimaryRoles(): Observable<Country[]> {
        const url = `${environment.api.baseUrl}/signup/roles`;
        return this.get<PrimaryRole[]>(url);
    }

    register(signupData: Signup): Observable<any> {
        const url = `${environment.api.baseUrl}/signup`;
        return this.post<Signup>(url, signupData);
    }

    auth0Signup(signupData: Signup): Observable<any> {
        const url = `https://${environment.auth0.domain}/dbconnections/signup`;

        const body = {
            client_id: environment.auth0.clientID,
            email: signupData.email,
            password: signupData.password,
            connection: environment.auth0.connection,
            name: signupData.name,
            user_metadata: {
                signupRole: signupData.signupRole,
                country: signupData.country,
                reason: signupData.reason,
                userRole: signupData.userRole,
                signupStatus: signupData.status,
            },
        };

        return this.post<Signup>(url, body);
    }
}
