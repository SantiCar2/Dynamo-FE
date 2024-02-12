import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../../environment/environment';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-inventory-add',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './inventory-add.component.html',
  styleUrl: './inventory-add.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class InventoryAddComponent implements OnInit {
  disableNext: boolean = false;
  inventoriesNames: string[] = [];
  selectedValue: string = '';

  newName: boolean = true;
  name: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InventoryAddComponent>,
  ) {}

  ngOnInit() {
    this.loadNames();
    this.onToggleChange({ value: 'modify' });
  }

  firstFormGroup = this._formBuilder.group({
    action: [''],
  });
  secondFormGroup = this._formBuilder.group({
    name: [''],
    newName: [''],
  });

  onToggleChange(event: any) {
    this.firstFormGroup.controls['action'].setValue(event.value);
    console.log(event.value);
    if (event.value == 'delete') {
      this.disableNext = true;

      this.secondFormGroup.controls['name'].enable();
      this.secondFormGroup.controls['newName'].disable();

      this.newName = false;
      this.name = true;
    } else {
      this.disableNext = false;
    }
    if (event.value == 'create') {
      this.secondFormGroup.controls['newName'].enable();
      this.secondFormGroup.controls['name'].disable();

      this.newName = true;
      this.name = false;
    }
    if (event.value == 'modify') {
      this.secondFormGroup.controls['newName'].enable();
      this.secondFormGroup.controls['name'].enable();

      this.newName = true;
      this.name = true;
    }
  }

  checkBoxChange(event: any) {
    this.disableNext = !event.checked;
  }

  loadNames() {
    this.httpClient
      .get(`${environment.api_url}/data/inventoriesNames`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.cookieService.get('token')}` || '',
        }),
      })
      .subscribe(
        (data: any) => {
          this.inventoriesNames = data.map((obj: { name: any }) => obj.name);
        },
        (error: any) => {
          if (error.status == '401') {
            this.openSnackBar('No autorizado, se redirigirá al login');
            this.cookieService.delete('token');
            setTimeout(() => {
              window.location.href = '/login';
            }, 7000);
          }
        },
      );
  }

  onSubmit() {
    const formData = {
      action: this.firstFormGroup.value.action,
      name: this.secondFormGroup.value.name,
      newName: this.secondFormGroup.value.newName,
    };

    if (formData.action == 'create') {
      const data = {
        newName: formData.newName,
      };
      
      this.httpClient
        .post(`${environment.api_url}/inventories/create`, data, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.cookieService.get('token')}` || '',
          }),
        })
        .subscribe(
          (data: any) => {
            this.openSnackBar(data.message);
            window.location.reload();
          },
          (error: any) => {
            this.noAuth(error);
          },
        );
      
      this.dialogRef.close();
    }else if (formData.action == 'delete') {
      this.httpClient
        .delete(`${environment.api_url}/inventories/${formData.name}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.cookieService.get('token')}` || '',
          }),
        })
        .subscribe(
          (data: any) => {
            this.openSnackBar(data.message);
            window.location.reload();
          },
          (error: any) => {
            this.noAuth(error);
          },
        );
      
        this.dialogRef.close();
    }else if (formData.action == 'modify') {
      const data = {
        newName: formData.newName,
      }
      this.httpClient
        .put(`${environment.api_url}/inventories/${formData.name}`, data, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.cookieService.get('token')}` || '',
          }),
        })
        .subscribe(
          (data: any) => {
            this.openSnackBar(data.message);
            window.location.reload();
          },
          (error: any) => {
            this.noAuth(error);
          },
        );

      this.dialogRef.close();
    }
  }

  noAuth(error: any) {
    if (error.status == '401') {
      this.openSnackBar('No autorizado, se redirigirá al login');
      this.cookieService.delete('token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 7000);
    }
    this.openSnackBar(error.error.message);
  }

  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
