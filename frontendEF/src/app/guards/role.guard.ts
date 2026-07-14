import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Ruolo } from '../entities/user.entity';

// Guard con factory: verifica che l'utente autenticato abbia uno dei ruoli consentiti.
// Va usato sempre dopo authGuard (che garantisce l'autenticazione).
// Esempio d'uso nelle route: canActivate: [authGuard, roleGuard('REFERENTE')]
export const roleGuard = (...ruoli: Ruolo[]): CanActivateFn => {
  return () => {
    const authSrv = inject(AuthService);
    const toastSrv = inject(ToastService);
    const router = inject(Router);

    return authSrv.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && ruoli.includes(user.ruolo)) {
          return true;
        }
        // ruolo non abilitato: avviso e reindirizzo alla dashboard
        toastSrv.error('Non hai i permessi per accedere a questa sezione.', 'Accesso negato');
        return router.createUrlTree(['/dashboard']);
      })
    );
  };
};
