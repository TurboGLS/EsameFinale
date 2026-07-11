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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { logoutInterceptor } from './interceptors/logout-interceptor';

@NgModule({
  declarations: [
    App, 
    RegisterComponent, 
    LoginComponent, 
    NavbarComponent, 
    NavUserComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, logoutInterceptor]))
  ],
  bootstrap: [App],
})
export class AppModule {}
