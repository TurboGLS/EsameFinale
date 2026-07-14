import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class NavbarComponent {
  protected authSrv = inject(AuthService);
  protected router = inject(Router);

  currentUser$ = this.authSrv.currentUser$;

  logout() {
    this.authSrv.logout();
    // dopo il logout riporto sempre l'utente alla pagina di login
    this.router.navigate(['/login']);
  }

}