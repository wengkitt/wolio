import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { FeatureModel } from '../../model/landing-page';

@Component({
  selector: 'app-landing-page',
  imports: [ButtonModule, Card],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  features: FeatureModel[] = [
    {
      key: 1,
      title: 'Expenses Tracker',
      description:
        'Track your daily expenses and understand your spending patterns',
      icon: 'pi pi-chart-line',
    },
    {
      key: 2,
      title: 'Wallet Management',
      description: 'Manage multiple wallets and keep track of your balances',
      icon: 'pi pi-wallet',
    },
    {
      key: 3,
      title: 'Investment Tracker',
      description: 'Monitor your investments and track portfolio performance',
      icon: 'pi pi-chart-bar',
    },
    {
      key: 4,
      title: 'Budget Tracker',
      description: 'Set and monitor budgets to achieve your financial goals',
      icon: 'pi pi-dollar',
    },
    {
      key: 5,
      title: 'Debt Tracker',
      description: 'Track and manage your debts to become debt-free',
      icon: 'pi pi-calculator',
    },
  ];
}
