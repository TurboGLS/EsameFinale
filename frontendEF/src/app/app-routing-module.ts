import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MieAssegnazioniComponent } from './pages/mie-assegnazioni/mie-assegnazioni';
import { CatalogoCorsiComponent } from './pages/catalogo-corsi/catalogo-corsi';
import { AssegnazioniComponent } from './pages/assegnazioni/assegnazioni';
import { StatisticheComponent } from './pages/statistiche/statistiche';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  // area dipendente
  {
    path: 'mie-assegnazioni',
    component: MieAssegnazioniComponent,
    canActivate: [authGuard, roleGuard('DIPENDENTE')]
  },
  // area referente Academy
  {
    path: 'corsi',
    component: CatalogoCorsiComponent,
    canActivate: [authGuard, roleGuard('REFERENTE')]
  },
  {
    path: 'assegnazioni',
    component: AssegnazioniComponent,
    canActivate: [authGuard, roleGuard('REFERENTE')]
  },
  {
    path: 'statistiche',
    component: StatisticheComponent,
    canActivate: [authGuard, roleGuard('REFERENTE')]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
