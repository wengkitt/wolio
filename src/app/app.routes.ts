import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { DebtDetailComponent } from './main/debt/debt-detail/debt-detail.component';
import { DebtListComponent } from './main/debt/debt-list/debt-list.component';
import { MainComponent } from './main/main.component';
import { TransactionsComponent } from './main/transactions/transactions.component';
import { WalletManagementComponent } from './main/wallet-management/wallet-management.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'wallets', component: WalletManagementComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'debts', component: DebtListComponent },
      { path: 'debts/:id', component: DebtDetailComponent },
    ],
  },
];
