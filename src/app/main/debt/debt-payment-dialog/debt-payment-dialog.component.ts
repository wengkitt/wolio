import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface DialogData {
  remainingAmount: number;
}

@Component({
  selector: 'app-debt-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './debt-payment-dialog.component.html',
  styleUrl: './debt-payment-dialog.component.scss',
})
export class DebtPaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DebtPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      amount: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(data.remainingAmount),
        ],
      ],
      note: [''],
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
