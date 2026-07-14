import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

// smart: pagina iniziale dopo il login, coerente con il ruolo dell'utente.
// Conosce l'utente corrente e presenta le funzionalità disponibili.
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  protected authSrv = inject(AuthService);

  currentUser$ = this.authSrv.currentUser$;
}
