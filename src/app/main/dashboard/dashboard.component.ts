import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  summaryCards = [
    {
      title: 'Total Balance',
      value: '$12,500',
      icon: 'account_balance',
      trend: '+2.5%',
    },
    {
      title: 'Monthly Expenses',
      value: '$2,300',
      icon: 'trending_down',
      trend: '-5.2%',
    },
    {
      title: 'Monthly Income',
      value: '$4,200',
      icon: 'trending_up',
      trend: '+8.1%',
    },
  ];
}
