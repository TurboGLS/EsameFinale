import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { User } from '../../entities/user.entity';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-user',
  standalone: false,
  templateUrl: './nav-user.html',
  styleUrl: './nav-user.css',
})

export class NavUserComponent {
  protected authSrv = inject(AuthService);

  @Input()
  user: User | null = null;

  @Output()
  logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }
}