import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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
  protected router = inject(Router);

  registerFrom = this.fb.group({
    firstName: new FormControl<string | null>(''),
    lastName: new FormControl<string | null>(''),
    picture: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.minLength(8)]
  });

  registerError = '';

  showPassword = false;

  requestedURL: string | null = null;


  ngOnInit() {
    this.registerFrom.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(_ => {
        this.registerError = '';
      })
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
    const { firstName, lastName, picture, username, password } = this.registerFrom.value;
    this.authSrv.register(firstName!, lastName!, picture!, username!, password!)
      .pipe(
        catchError(response => {
          this.registerError = response.error.message;
          return throwError(() => response);
        })
      )
      .subscribe(() => {
        this.router.navigate([this.requestedURL ? this.requestedURL : '/']);
      })
  }
}