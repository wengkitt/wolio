import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-nav',

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
    { icon: 'dashboard', label: 'Dashboard', route: '/main/dashboard' },
    {
      icon: 'receipt_long',
      label: 'Transactions',
      route: '/main/transactions',
    },
    // { icon: 'payments', label: 'Debts', route: '/main/debts' },
    {
      icon: 'account_balance_wallet',
      label: 'Wallets',
      route: '/main/wallets',
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  logout() {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.snackBar.open(
          error.message || 'An error occurred during login',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
  }
}
