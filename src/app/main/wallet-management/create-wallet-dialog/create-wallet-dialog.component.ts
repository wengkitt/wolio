import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-wallet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-wallet-dialog.component.html',
  styleUrl: './create-wallet-dialog.component.scss',
})
export class CreateWalletDialogComponent {
  walletForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateWalletDialogComponent>,
    private fb: FormBuilder
  ) {
    this.walletForm = this.fb.group({
      name: ['', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.walletForm.valid) {
      this.dialogRef.close(this.walletForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
