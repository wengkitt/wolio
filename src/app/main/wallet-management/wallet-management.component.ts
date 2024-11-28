import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CreateWalletDialogComponent } from './create-wallet-dialog/create-wallet-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

interface Transfer {
  id: string;
  fromWallet: string;
  toWallet: string;
  amount: number;
  date: Date;
}

@Component({
  selector: 'app-wallet-management',

  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
  ],
  templateUrl: './wallet-management.component.html',
  styleUrl: './wallet-management.component.scss',
})
export class WalletManagementComponent {
  wallets = signal<Wallet[]>([
    { id: '1', name: 'Main Wallet', balance: 5000 },
    { id: '2', name: 'Savings', balance: 7500 },
  ]);

  transfers = signal<Transfer[]>([
    {
      id: '1',
      fromWallet: 'Main Wallet',
      toWallet: 'Savings',
      amount: 1000,
      date: new Date('2024-11-22'),
    },
  ]);

  dataSource = new MatTableDataSource<Transfer>(this.transfers());

  displayedColumns: string[] = ['date', 'fromWallet', 'toWallet', 'amount'];

  constructor(private dialog: MatDialog) {}

  openCreateWalletDialog() {
    const dialogRef = this.dialog.open(CreateWalletDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wallets.update((currentWallets) => [
          {
            id: (currentWallets.length + 1).toString(),
            name: result.name,
            balance: result.initialBalance,
          },
          ...currentWallets,
        ]);
      }
    });
  }

  openTransferDialog() {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      width: '400px',
      data: { wallets: this.wallets() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update wallet balances
        const fromWallet = this.wallets().find(
          (w) => w.id === result.fromWalletId
        );
        const toWallet = this.wallets().find((w) => w.id === result.toWalletId);

        if (fromWallet && toWallet) {
          fromWallet.balance -= result.amount;
          toWallet.balance += result.amount;

          // Add transfer record
          this.transfers.update((currentTransfers) => [
            {
              id: (currentTransfers.length + 1).toString(),
              fromWallet: fromWallet.name,
              toWallet: toWallet.name,
              amount: result.amount,
              date: new Date(),
            },
            ...currentTransfers,
          ]);

          this.dataSource.data = [...this.transfers()];
        }
      }
    });
  }
}
