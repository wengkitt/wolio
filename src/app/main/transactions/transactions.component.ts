import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';

interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  walletId: string;
  walletName: string;
  date: Date;
}

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatMenuModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  transactions: Transaction[] = [];
  wallets: Wallet[] = [
    { id: '1', name: 'Main Wallet', balance: 5000 },
    { id: '2', name: 'Savings', balance: 7500 },
  ];

  displayedColumns: string[] = [
    'date',
    'type',
    'description',
    'wallet',
    'amount',
    'actions',
  ];

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  openTransactionDialog(transaction?: Transaction) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '500px',
      data: {
        wallets: this.wallets,
        transaction,
        isEdit: !!transaction,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (transaction) {
          this.updateTransaction(transaction.id, result);
        } else {
          this.addTransaction(result);
        }
      }
    });
  }

  private addTransaction(formValue: any) {
    const selectedWallet = this.wallets.find(
      (w) => w.id === formValue.walletId
    );

    if (!selectedWallet) {
      this.showError('Selected wallet not found');
      return;
    }

    if (
      formValue.type === 'expense' &&
      selectedWallet.balance < formValue.amount
    ) {
      this.showError('Insufficient funds in selected wallet');
      return;
    }

    // Update wallet balance
    selectedWallet.balance +=
      formValue.type === 'expense' ? -formValue.amount : formValue.amount;

    // Add transaction
    this.transactions.unshift({
      id: (this.transactions.length + 1).toString(),
      type: formValue.type,
      amount: formValue.amount,
      description: formValue.description || 'No description',
      walletId: formValue.walletId,
      walletName: selectedWallet.name,
      date: formValue.date,
    });

    this.showSuccess('Transaction added successfully');
  }

  private updateTransaction(transactionId: string, formValue: any) {
    const index = this.transactions.findIndex((t) => t.id === transactionId);
    if (index === -1) {
      this.showError('Transaction not found');
      return;
    }

    const oldTransaction = this.transactions[index];
    const oldWallet = this.wallets.find(
      (w) => w.id === oldTransaction.walletId
    );
    const newWallet = this.wallets.find((w) => w.id === formValue.walletId);

    if (!oldWallet || !newWallet) {
      this.showError('Wallet not found');
      return;
    }

    // Revert old transaction
    oldWallet.balance +=
      oldTransaction.type === 'expense'
        ? oldTransaction.amount
        : -oldTransaction.amount;

    // Check if new transaction is valid
    if (formValue.type === 'expense' && newWallet.balance < formValue.amount) {
      // Restore old transaction effect
      oldWallet.balance +=
        oldTransaction.type === 'expense'
          ? -oldTransaction.amount
          : oldTransaction.amount;
      this.showError('Insufficient funds in selected wallet');
      return;
    }

    // Apply new transaction
    newWallet.balance +=
      formValue.type === 'expense' ? -formValue.amount : formValue.amount;

    // Update transaction
    this.transactions[index] = {
      ...oldTransaction,
      type: formValue.type,
      amount: formValue.amount,
      description: formValue.description || 'No description',
      walletId: formValue.walletId,
      walletName: newWallet.name,
      date: formValue.date,
    };

    this.showSuccess('Transaction updated successfully');
  }

  deleteTransaction(transaction: Transaction) {
    const wallet = this.wallets.find((w) => w.id === transaction.walletId);
    if (!wallet) {
      this.showError('Wallet not found');
      return;
    }

    // Revert transaction effect on wallet
    wallet.balance +=
      transaction.type === 'expense' ? transaction.amount : -transaction.amount;

    // Remove transaction
    this.transactions = this.transactions.filter(
      (t) => t.id !== transaction.id
    );
    this.showSuccess('Transaction deleted successfully');
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
