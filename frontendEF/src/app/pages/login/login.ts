import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map, Subject, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected toastSrv = inject(ToastService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected destroyed$ = new Subject<void>();

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  showPassword = false;

  loading = false;

  requestedUrl: string | null = null;

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        map(params => params['requestedUrl'])
      )
      .subscribe(url => {
        this.requestedUrl = url;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    // evito submit multipli mentre la richiesta è in corso
    if (this.loading) {
      return;
    }
    this.loading = true;

    const { username, password } = this.loginForm.value;
    this.authSrv.login(username!, password!)
      .pipe(
        catchError(response => {
          // 401 credenziali non valide
          const message = response.status === 401
            ? 'Credenziali errate'
            : 'Impossibile effettuare l\'accesso. Riprova più tardi.';
          this.toastSrv.error(message, 'Accesso non riuscito');
          return throwError(() => response);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(() => {
        this.toastSrv.success('Accesso effettuato con successo.', 'Bentornato');
        this.router.navigate([this.requestedUrl ? this.requestedUrl : '/']);
      })
  }
}