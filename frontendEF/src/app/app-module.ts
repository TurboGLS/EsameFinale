import { NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar';
import { NavUserComponent } from './components/nav-user/nav-user';
import { ToastComponent } from './components/toast/toast';
import { ToastContainerComponent } from './pages/toast-container/toast-container';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { logoutInterceptor } from './interceptors/logout-interceptor';
import { StatoBadgeComponent } from './components/stato-badge/stato-badge';
import { AssegnazioneCardComponent } from './components/assegnazione-card/assegnazione-card';
import { CorsoCardComponent } from './components/corso-card/corso-card';
import { CorsoFormComponent } from './components/corso-form/corso-form';
import { AssegnazioneFormComponent } from './components/assegnazione-form/assegnazione-form';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MieAssegnazioniComponent } from './pages/mie-assegnazioni/mie-assegnazioni';
import { CatalogoCorsiComponent } from './pages/catalogo-corsi/catalogo-corsi';
import { AssegnazioniComponent } from './pages/assegnazioni/assegnazioni';
import { StatisticheComponent } from './pages/statistiche/statistiche';

@NgModule({
  declarations: [
    App,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    NavUserComponent,
    ToastComponent,
    ToastContainerComponent,
    StatoBadgeComponent,
    AssegnazioneCardComponent,
    CorsoCardComponent,
    CorsoFormComponent,
    AssegnazioneFormComponent,
    ConfirmModalComponent,
    DashboardComponent,
    MieAssegnazioniComponent,
    CatalogoCorsiComponent,
    AssegnazioniComponent,
    StatisticheComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor, logoutInterceptor]))
  ],
  bootstrap: [App],
})
export class AppModule {}
