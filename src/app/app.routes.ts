import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((m) => m.SignupComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    canActivate: [publicGuard],
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./auth/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./main/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'wallets',
        loadComponent: () =>
          import('./main/wallet-management/wallet-management.component').then(
            (m) => m.WalletManagementComponent
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./main/transactions/transactions.component').then(
            (m) => m.TransactionsComponent
          ),
      },
      {
        path: 'debts',
        loadComponent: () =>
          import('./main/debt/debt-list/debt-list.component').then(
            (m) => m.DebtListComponent
          ),
      },
      {
        path: 'debts/:id',
        loadComponent: () =>
          import('./main/debt/debt-detail/debt-detail.component').then(
            (m) => m.DebtDetailComponent
          ),
      },
    ],
  },
];
