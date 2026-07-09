import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { JwtService } from "./jwt.service";
import { Router } from "@angular/router";
import { catchError, distinctUntilChanged, map, of, ReplaySubject, tap } from "rxjs";
import { User } from "../entities/user.entity";
import { environment } from "../../enviroments/enviroments";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    protected http = inject(HttpClient);
    protected jwtSrv = inject(JwtService);
    protected router = inject(Router);

    protected _currentUser$ = new ReplaySubject<User | null>(1);
    currentUser$ = this._currentUser$.asObservable();

    isAuthenticated$ = this.currentUser$
        .pipe(
            map(user => !!user),
            distinctUntilChanged()
        );

    constructor() {
        this.fetchUser().subscribe();
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { username, password })
            .pipe(
                tap(res => this.jwtSrv.setToken(res.token)),
                tap(res => this._currentUser$.next(res.user)),
                map(res => res.user)
            );
    }

    fetchUser() {
        return this.http.get<User>(`${environment.apiUrl}/users/me`)
            .pipe(
                catchError(_ => {
                    return of(null);
                }),
                tap(user => this._currentUser$.next(user))
            );
    }

    logout() {
        this.jwtSrv.removeToken();
        this._currentUser$.next(null);
    }

    register(firstName: string, lastName: string, picture: string, username: string, password: string) {
        return this.http.post(`${environment.apiUrl}/register`, { username, password, picture, firstName, lastName });
    }
}