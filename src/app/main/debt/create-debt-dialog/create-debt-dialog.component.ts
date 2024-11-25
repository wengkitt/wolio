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
  selector: 'app-create-debt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-debt-dialog.component.html',
  styleUrl: './create-debt-dialog.component.scss',
})
export class CreateDebtDialogComponent {
  debtForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateDebtDialogComponent>,
    private fb: FormBuilder
  ) {
    this.debtForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      amount: [
        null,
        [Validators.required, Validators.min(0.01), Validators.max(1000000)],
      ],
    });
  }

  onSubmit() {
    if (this.debtForm.valid) {
      this.dialogRef.close(this.debtForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
