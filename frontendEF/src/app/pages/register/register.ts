import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class RegisterComponent implements OnInit, OnDestroy{
  protected fb = inject(FormBuilder);
  protected destroyed$ = new Subject<void>();
  protected activatedRoute = inject(ActivatedRoute);
  protected authSrv = inject(AuthService);
  protected toastSrv = inject(ToastService);
  protected router = inject(Router);

  registerFrom = this.fb.group({
    firstName: new FormControl<string | null>(''),
    lastName: new FormControl<string | null>(''),
    picture: ['', Validators.required],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
    ]]
  });

  showPassword = false;

  loading = false;

  requestedURL: string | null = null;


  ngOnInit() {
      this.activatedRoute.queryParams
        .pipe(
          takeUntil(this.destroyed$),
          map(params => params['requestedURL'])
        )
        .subscribe(url => {
          this.requestedURL = url;
        })
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    // evito submit multipli mentre la richiesta è in corso
    if (this.loading) {
      return;
    }
    this.loading = true;

    const { firstName, lastName, picture, username, password } = this.registerFrom.value;
    this.authSrv.register(firstName!, lastName!, picture!, username!, password!)
      .pipe(
        catchError(response => {
          this.toastSrv.error(response.error?.message ?? 'Impossibile completare la registrazione.', 'Registrazione non riuscita');
          return throwError(() => response);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(() => {
        this.toastSrv.success('Registrazione avvenuta con successo. Ora puoi accedere.', 'Account creato');
        // Dopo la registrazione l'utente non è ancora autenticato quindi lo mando al login (inoltrando la requestedURL se presente)
        this.router.navigate(['/login'], {
          queryParams: this.requestedURL ? { requestedUrl: this.requestedURL } : {}
        });
      })
  }
}