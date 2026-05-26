import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar';
import { NavUserComponent } from './components/nav-user/nav-user';

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
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
