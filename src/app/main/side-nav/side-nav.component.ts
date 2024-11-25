import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/app/dashboard' },
    { icon: 'receipt_long', label: 'Transactions', route: '/app/transactions' },
    { icon: 'payments', label: 'Debts', route: '/app/debts' },
    { icon: 'account_balance_wallet', label: 'Wallets', route: '/app/wallets' },
  ];

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/']);
  }
}
