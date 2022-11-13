import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    get(id: number) {
        let url = `${environment.api.baseUrl}/users`;

        if (id) {
            url += `/${id}`;
        }
        return this.http.get<User>(url);
    }
}