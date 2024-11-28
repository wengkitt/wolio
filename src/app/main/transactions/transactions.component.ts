import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartConfiguration,
  ChartData,
  BarController,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

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

  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    BaseChartDirective,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartData: ChartData = {
    labels: [],
    datasets: [
      {
        label: 'Income',
        data: [],
        backgroundColor: '#4caf50',
      },
      {
        label: 'Expenses',
        data: [],
        backgroundColor: '#f44336',
      },
    ],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'category', // Explicit x-axis scale type
      },
      y: {
        type: 'linear', // Explicit y-axis scale type
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      description: 'Salary for November',
      walletId: '1',
      walletName: 'Main Wallet',
      date: new Date('2024-11-01'),
    },
    {
      id: '2',
      type: 'expense',
      amount: 50,
      description: 'Coffee at Starbucks',
      walletId: '1',
      walletName: 'Main Wallet',
      date: new Date('2024-11-02'),
    },
    {
      id: '3',
      type: 'expense',
      amount: 120,
      description: 'Groceries at Walmart',
      walletId: '1',
      walletName: 'Main Wallet',
      date: new Date('2024-11-03'),
    },
    {
      id: '4',
      type: 'income',
      amount: 200,
      description: 'Freelance project payment',
      walletId: '2',
      walletName: 'Savings Wallet',
      date: new Date('2024-11-05'),
    },
    {
      id: '5',
      type: 'expense',
      amount: 75,
      description: 'Movie tickets',
      walletId: '1',
      walletName: 'Main Wallet',
      date: new Date('2024-11-06'),
    },
    {
      id: '6',
      type: 'income',
      amount: 300,
      description: 'Gift from parents',
      walletId: '2',
      walletName: 'Savings Wallet',
      date: new Date('2024-11-08'),
    },
    {
      id: '7',
      type: 'expense',
      amount: 30,
      description: 'Taxi fare',
      walletId: '2',
      walletName: 'Savings Wallet',
      date: new Date('2024-11-09'),
    },
    {
      id: '8',
      type: 'income',
      amount: 1000,
      description: 'Bonus',
      walletId: '1',
      walletName: 'Main Wallet',
      date: new Date('2024-11-10'),
    },
    {
      id: '9',
      type: 'expense',
      amount: 500,
      description: 'Rent for November',
      walletId: '1',
      walletName: 'Main Wallet',
      date: new Date('2024-11-11'),
    },
    {
      id: '10',
      type: 'expense',
      amount: 100,
      description: 'Utilities bill',
      walletId: '2',
      walletName: 'Savings Wallet',
      date: new Date('2024-11-15'),
    },
  ];

  filteredTransactions: Transaction[] = [];
  wallets: Wallet[] = [
    { id: '1', name: 'Main Wallet', balance: 5000 },
    { id: '2', name: 'Savings', balance: 7500 },
    { id: '3', name: 'Main Wallet', balance: 5000 },
    { id: '4', name: 'Savings', balance: 7500 },
    { id: '5', name: 'Main Wallet', balance: 5000 },
    { id: '6', name: 'Savings', balance: 7500 },
    { id: '7', name: 'Main Wallet', balance: 5000 },
    { id: '8', name: 'Savings', balance: 7500 },
  ];

  displayedColumns: string[] = [
    'date',
    'type',
    'description',
    'wallet',
    'amount',
    'actions',
  ];

  filterForm: FormGroup;
  selectedRange = 'month';

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
    });
  }

  ngOnInit() {
    this.setDateRange(this.selectedRange);
  }

  setDateRange(range: string) {
    const today = new Date();
    let startDate = new Date();

    switch (range) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'custom':
        return; // Don't update dates for custom range
    }

    this.filterForm.patchValue({
      startDate,
      endDate: today,
    });

    this.selectedRange = range;
    this.applyFilter();
  }

  applyFilter() {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;

    if (startDate && endDate) {
      this.filteredTransactions = this.transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      this.updateChart();
    }
  }

  private updateChart() {
    const dateLabels = new Set<string>();
    const incomeData: { [key: string]: number } = {};
    const expenseData: { [key: string]: number } = {};

    this.filteredTransactions.forEach((t) => {
      const dateStr = new Date(t.date).toLocaleDateString();
      dateLabels.add(dateStr);

      if (t.type === 'income') {
        incomeData[dateStr] = (incomeData[dateStr] || 0) + t.amount;
      } else {
        expenseData[dateStr] = (expenseData[dateStr] || 0) + t.amount;
      }
    });

    const sortedLabels = Array.from(dateLabels).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    this.chartData = {
      labels: sortedLabels,
      datasets: [
        {
          label: 'Income',
          data: sortedLabels.map((date) => incomeData[date] || 0),
          backgroundColor: '#4caf50',
        },
        {
          label: 'Expenses',
          data: sortedLabels.map((date) => expenseData[date] || 0),
          backgroundColor: '#f44336',
        },
      ],
    };

    this.chart?.update();
  }

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
    const newTransaction: Transaction = {
      id: (this.transactions.length + 1).toString(),
      type: formValue.type,
      amount: formValue.amount,
      description: formValue.description || 'No description',
      walletId: formValue.walletId,
      walletName: selectedWallet.name,
      date: formValue.date,
    };

    this.transactions.unshift(newTransaction);
    this.applyFilter();
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

    this.applyFilter();
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
    this.applyFilter();
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
