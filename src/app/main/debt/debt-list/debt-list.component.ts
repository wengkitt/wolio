import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateDebtDialogComponent } from '../create-debt-dialog/create-debt-dialog.component';

export interface DebtItem {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  createdAt: Date;
}

@Component({
  selector: 'app-debt-list',

  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './debt-list.component.html',
  styleUrl: './debt-list.component.scss',
})
export class DebtListComponent {
  debts: DebtItem[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  openCreateDebtDialog() {
    const dialogRef = this.dialog.open(CreateDebtDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createDebt(result);
      }
    });
  }

  createDebt(data: { name: string; amount: number }) {
    const newDebt: DebtItem = {
      id: (this.debts.length + 1).toString(),
      name: data.name,
      totalAmount: data.amount,
      remainingAmount: data.amount,
      createdAt: new Date(),
    };

    this.debts.unshift(newDebt);
    this.showSuccess('Debt item created successfully');
  }

  calculateProgress(debt: DebtItem): number {
    return ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
  }

  viewDebtDetails(debtId: string) {
    this.router.navigate(['/app/debts', debtId]);
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }
}
