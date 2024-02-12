import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../../environment/environment';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { Observable, delay, map, startWith } from 'rxjs';

@Component({
  selector: 'app-product-add',
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
    MatAutocompleteModule,
  ],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css',
})
export class ProductAddComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  disableNext: boolean = false;
  productsNames: string[] = [];
  filteredProductsNames: string[] = [];
  selectedValue: string = '';

  newName: boolean = true;
  name: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProductAddComponent>,
  ) {this.filteredProductsNames = this.productsNames.slice();}

  ngOnInit() {
    this.loadNames();
    this.onToggleChange({ value: 'modify' });
  }

  loadNames() {
    this.httpClient
      .get(`${environment.api_url}/products/getNames`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.cookieService.get('token')}` || '',
        }),
      })
      .subscribe(
        (data: any) => {
          this.productsNames = data.map((obj: { SKU: any }) => obj.SKU);
        },
        (error: any) => {
          this.noAuth(error);
        },
      );
  }

  onToggleChange(event: any) {
    this.firstFormGroup.controls['action'].setValue(event.value);
    console.log(event.value);
    if (event.value == 'delete') {
      this.secondFormGroup.disable();
      this.secondFormGroup.controls['SKU'].enable();
      
      this.disableNext = true;
    } else {
      this.disableNext = false;
    }
    if (event.value == 'create') {
      this.secondFormGroup.disable();
      this.secondFormGroup.controls['newName'].enable();
      this.secondFormGroup.controls['newSKU'].enable();
      this.secondFormGroup.controls['newDescription'].enable();

      this.newName = true;
      this.name = false;
    }
    if (event.value == 'modify') {
      this.secondFormGroup.enable();

      this.newName = true;
      this.name = true;
    }
  }

  firstFormGroup = this._formBuilder.group({
    action: [''],
  });
  secondFormGroup = this._formBuilder.group({
    SKU: [''],
    newName: [''],
    newSKU: [''],
    newDescription: [''],
  });

  onSubmit() {
    const formData = {
      action: this.firstFormGroup.value.action,
      oldSKU: this.secondFormGroup.value.SKU,
      newName: this.secondFormGroup.value.newName,

    };

    if (formData.action == 'create') {
      const data = {
        name: formData.newName,
        SKU: this.secondFormGroup.value.newSKU,
        description: this.secondFormGroup.value.newDescription,
        CBM: 0,
      };
      
      this.httpClient
        .post(`${environment.api_url}/products/create`, data, {
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
        .delete(`${environment.api_url}/products/delete/${formData.oldSKU}`, {
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
        oldSKU: formData.oldSKU,
        name: this.secondFormGroup.value.newName,
        SKU: this.secondFormGroup.value.newSKU,
        description: this.secondFormGroup.value.newDescription,
        CBM: 0,
      }
      this.httpClient
        .put(`${environment.api_url}/products/update/`, data, {
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

  checkBoxChange(event: any) {
    this.disableNext = !event.checked;
  }

  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();

    this.filteredProductsNames = this.productsNames.filter(name => name.toLowerCase().includes(filterValue));
  }

}
