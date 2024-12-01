import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CreateWalletDialogComponent } from './create-wallet-dialog/create-wallet-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { WalletService } from '../../services/wallet.service';
import { Wallet, WalletTransfer } from '../../interfaces/wallet.interface';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

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
export class WalletManagementComponent implements OnInit {
  wallets = signal<Wallet[]>([]);
  transfers = signal<WalletTransfer[]>([]);
  dataSource = new MatTableDataSource<WalletTransfer>();
  displayedColumns: string[] = ['date', 'fromWallet', 'toWallet', 'amount'];

  constructor(
    private dialog: MatDialog,
    private walletService: WalletService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.walletService.wallets$.subscribe((wallets) => {
      this.wallets.set(wallets);
    });

    this.walletService.transfers$.subscribe((transfers) => {
      this.transfers.set(transfers);
      this.dataSource.data = transfers;
    });
  }

  openCreateWalletDialog() {
    const dialogRef = this.dialog.open(CreateWalletDialogComponent, {
      width: '400px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          console.log(result);
          if (result) {
            return this.walletService
              .createWallet({
                name: result.name,
                balance: result.initialBalance,
              })
              .pipe(
                tap(() => {
                  this.showSuccess('Wallet created successfully');
                }),
                catchError((error) => {
                  this.showError(error.message || 'Failed to create wallet');
                  return EMPTY;
                })
              );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  openTransferDialog() {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      width: '400px',
      data: { wallets: this.wallets() },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.walletService
              .transfer({
                from_wallet_id: result.fromWalletId,
                to_wallet_id: result.toWalletId,
                amount: result.amount,
              })
              .pipe(
                tap(() => {
                  this.showSuccess('Transfer completed successfully');
                }),
                catchError((error) => {
                  this.showError(
                    error.message || 'Failed to complete transfer'
                  );
                  return EMPTY;
                })
              );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
