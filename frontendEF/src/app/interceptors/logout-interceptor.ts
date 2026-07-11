import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroments';

export const logoutInterceptor: HttpInterceptorFn = (req, next) => {
  const authSrv = inject(AuthService);
  const toastSrv = inject(ToastService);
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
              // il refresh è fallito: sessione scaduta, riporto al login
              toastSrv.error('La sessione è scaduta, effettua di nuovo l\'accesso.', 'Sessione scaduta');
              authSrv.logout();
              router.navigate(['/login']);
              return throwError(() => response)
            })
          )
      }

      // qualsiasi altro errore API viene notificato con un toast
      const message = response?.error?.message ?? 'Si è verificato un errore imprevisto. Riprova più tardi.';
      toastSrv.error(message);
      return throwError(() => response);
    })
  );
};