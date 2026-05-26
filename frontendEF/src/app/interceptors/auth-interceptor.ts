import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const logoutInterceptor: HttpInterceptorFn = (req, next) => {
  const authSrv = inject(AuthService);

  return next(req).pipe(
    catchError((response: any) => {
      if (response instanceof HttpErrorResponse && response.status === 401) {
        authSrv.logout();
      }
      return throwError(() => response);
    })
  )
};