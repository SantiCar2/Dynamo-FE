import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface DialogData {
  title: string;
  message: string;
  number: number;
}

@Component({
  selector: 'app-dollar-input-dialog',
  standalone: true,
  imports: [MatInputModule, FormsModule, CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './dollar-input-dialog.component.html',

})
export class DollarInputDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DollarInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onConfirm() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
}
