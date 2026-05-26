import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class NavbarComponent {
  protected authSrv = inject(AuthService);

  currentUser$ = this.authSrv.currentUser$;

  logout() {
    this.authSrv.logout();
  }

}