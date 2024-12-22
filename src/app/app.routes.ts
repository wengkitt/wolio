import { Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth.guard';
import { DashboardComponent } from './routes/protected/dashboard/dashboard.component';
import { ProtectedComponent } from './routes/protected/protected.component';
import { LandingPageComponent } from './routes/unprotected/landing-page/landing-page.component';
import { LoginComponent } from './routes/unprotected/login/login.component';
import { SignUpComponent } from './routes/unprotected/sign-up/sign-up.component';
import { UnprotectedComponent } from './routes/unprotected/unprotected.component';

export const routes: Routes = [
  {
    path: '',
    component: UnprotectedComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
    ],
  },
  {
    path: '',
    component: ProtectedComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
