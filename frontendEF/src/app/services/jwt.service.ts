import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  protected storageKey = 'authToken';

  hasToken() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem(this.storageKey);
  }

  setToken(value: string) {
    localStorage.setItem(this.storageKey, value);
  }

  removeToken() {
    localStorage.removeItem(this.storageKey);
  }
}