import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { environment } from '../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    protected http = inject(HttpClient);
    protected baseUrl = `${environment.apiUrl}/users`;

    // elenco dei dipendenti
    getDipendenti(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/dipendenti`);
    }
}
