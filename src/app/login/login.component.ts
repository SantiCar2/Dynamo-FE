import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

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
  token: string = this.cookieService.get('token');  //Obtiene el token de la cookie

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar, 
    private router: Router, 
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private dialog: MatDialog
    ) {

    this.loginForm = this.fb.group({  //Crea el formulario de inicio de sesión
      user: '',
      pass: ''
    });
  }
  ngOnInit() {  //Verifica si hay un token en la cookie y si es válido
    if (this.token) {
      this.httpClient.post(`${environment.api_url}/auth/verify`, { token: this.token }).subscribe((res: any) => {
        const expDate = new Date(res.exp * 1000);

        const dualogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: `Sesión activa de ${res.email}`,
            message: `Su sesión se cerrará el ${expDate.toLocaleDateString()} a las ${expDate.toLocaleTimeString()}. ¿Desea continuar?`
          }
        });
        dualogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.router.navigate(['/dashboard'], {queryParams: {newSession: true} });
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

  onSubmit() {  //Se ejecuta al enviar el formulario de inicio de sesión y envía los datos al servidor
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
      console.log(res.access_token);
      console.log(this.cookieService.get('token'));
      this.router.navigate(['/dashboard'], {queryParams: {newSession: true} });
    }, (error: any) => {
      this.loading = false;
      this.loginForm.patchValue({['pass']: ''});
      this.openSnackBar(error.error.message);
    });
  }
  openSnackBar(message: string, action: string = 'Cerrar') {  //Muestra un mensaje emergente en la parte inferior de la pantalla
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
