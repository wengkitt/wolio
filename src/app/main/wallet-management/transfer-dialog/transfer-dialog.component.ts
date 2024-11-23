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
import { MatSelectModule } from '@angular/material/select';

interface DialogData {
  wallets: any[];
}

@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.scss',
})
export class TransferDialogComponent {
  transferForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<TransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.transferForm = this.fb.group(
      {
        fromWalletId: ['', Validators.required],
        toWalletId: ['', Validators.required],
        amount: [0, [Validators.required, Validators.min(0.01)]],
      },
      { validators: this.differentWalletsValidator }
    );
  }

  differentWalletsValidator(group: FormGroup) {
    const fromWallet = group.get('fromWalletId')?.value;
    const toWallet = group.get('toWalletId')?.value;
    return fromWallet && toWallet && fromWallet !== toWallet
      ? null
      : { sameWallet: true };
  }

  onSubmit() {
    if (this.transferForm.valid) {
      const fromWallet = this.data.wallets.find(
        (w) => w.id === this.transferForm.value.fromWalletId
      );
      if (fromWallet && fromWallet.balance >= this.transferForm.value.amount) {
        this.dialogRef.close(this.transferForm.value);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
