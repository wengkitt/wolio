import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DebtItem } from '../debt-list/debt-list.component';
import { DebtPaymentDialogComponent } from '../debt-payment-dialog/debt-payment-dialog.component';

interface PaymentTransaction {
  id: string;
  amount: number;
  date: Date;
  note?: string;
}

@Component({
  selector: 'app-debt-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './debt-detail.component.html',
  styleUrl: './debt-detail.component.scss',
})
export class DebtDetailComponent implements OnInit {
  debt?: DebtItem;
  payments: PaymentTransaction[] = [];
  displayedColumns: string[] = ['date', 'amount', 'note'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // In a real app, you would fetch the debt details from a service
    this.debt = {
      id: id!,
      name: 'Sample Debt',
      totalAmount: 5000,
      remainingAmount: 3000,
      createdAt: new Date(),
    };
  }

  calculateProgress(): number {
    if (!this.debt) return 0;
    return (
      ((this.debt.totalAmount - this.debt.remainingAmount) /
        this.debt.totalAmount) *
      100
    );
  }

  openPaymentDialog() {
    if (!this.debt) return;

    const dialogRef = this.dialog.open(DebtPaymentDialogComponent, {
      width: '400px',
      data: {
        remainingAmount: this.debt.remainingAmount,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addPayment(result);
      }
    });
  }

  private addPayment(data: { amount: number; note?: string }) {
    if (!this.debt) return;

    if (data.amount > this.debt.remainingAmount) {
      this.showError('Payment amount cannot exceed remaining debt');
      return;
    }

    const payment: PaymentTransaction = {
      id: (this.payments.length + 1).toString(),
      amount: data.amount,
      date: new Date(),
      note: data.note,
    };

    this.payments.unshift(payment);
    this.debt.remainingAmount -= data.amount;

    this.showSuccess('Payment added successfully');
  }

  goBack() {
    this.router.navigate(['/app/debts']);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }
}
