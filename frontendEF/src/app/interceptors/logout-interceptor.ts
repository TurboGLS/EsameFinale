import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroments';

export const logoutInterceptor: HttpInterceptorFn = (req, next) => {
  const authSrv = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);

  // Entra in gioco sulla risposta delle API
  const excludedRequests = [`${environment.apiUrl}/login`, `${environment.apiUrl}/refresh`];
  if (excludedRequests.includes(req.url)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((response: any) => {
      if (response instanceof HttpErrorResponse && response.status === 401) {
        // se la chiamata originale torna 401 faccio la chiamata di refresh
        return authSrv.refresh()
          .pipe(
            switchMap(_ => {
              return http.request(req.clone());
            }),
            catchError(_ => {
              authSrv.logout();
              router.navigate(['/login']);
              return throwError(() => response)
            })
          )
      }
      return throwError(() => response);
    })
  );
};