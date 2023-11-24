import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { environment } from '../../environment/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './index.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar, 
    private router: Router, 
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private dialog: MatDialog
    ) {
    this.loginForm = this.fb.group({
      user: '',
      pass: ''
    });
  }
  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token) {
      this.httpClient.post(`${environment.api_url}/auth/verify`, { token: token }).subscribe((res: any) => {
        const expDate = new Date(res.exp * 1000);

        const dualogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: `Sesión activa de ${res.email}`,
            message: `Su sesión se cerrará el ${expDate.toLocaleDateString()} a las ${expDate.toLocaleTimeString()}. ¿Desea continuar?`
          }
        });
        dualogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.router.navigate(['/dashboard']);
          } else {
            this.cookieService.delete('token');
            this.loginForm.patchValue({['user']: res.email})
          }
        });
      }, (error: any) => {
        this.cookieService.delete('token');
      });
    }
  }

  onSubmit() {
    const formData = this.loginForm.value;
    this.loading = true;

    const postData = {
      email: formData.user,
      password: formData.pass
    };
    if (formData.user === '' || formData.pass === '') {
      this.loading = false;
      this.openSnackBar('Debe ingresar usuario y contraseña!');
      return;
    }
    this.httpClient.post(`${environment.api_url}/auth/login`, postData).subscribe((res: any) => {
      this.loading = false;
      this.cookieService.set('token', res.access_token);
      this.router.navigate(['/dashboard']);
    }, (error: any) => {
      this.loading = false;
      this.loginForm.patchValue({['pass']: ''});
      this.openSnackBar('Credenciales incorrectas!');
    });
  }
  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
