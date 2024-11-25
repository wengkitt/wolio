import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface DialogData {
  wallets: any[];
  transaction?: any;
  isEdit: boolean;
}

@Component({
  selector: 'app-transaction-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrl: './transaction-dialog.component.scss',
})
export class TransactionDialogComponent {
  transactionForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.transactionForm = this.fb.group({
      type: ['expense', Validators.required],
      amount: [
        null,
        [Validators.required, Validators.min(0.01), Validators.max(1000000)],
      ],
      description: [''],
      walletId: ['', Validators.required],
      date: [new Date(), Validators.required],
    });

    if (data.isEdit && data.transaction) {
      this.transactionForm.patchValue({
        type: data.transaction.type,
        amount: data.transaction.amount,
        description: data.transaction.description,
        walletId: data.transaction.walletId,
        date: data.transaction.date,
      });
    }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.dialogRef.close(this.transactionForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
