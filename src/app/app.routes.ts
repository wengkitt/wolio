import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
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
