import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatTooltipModule, CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './index.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar, 
    private router: Router, 
    private cookieService: CookieService,
    private httpClient: HttpClient,
    ) {
      
    this.signupForm = this.fb.group({ //Crea el formulario de registro
      user: '',
      pass: '',
      confirmPass: '',
      name: '',
      twoFA: '',
      role: ''
    });
  }

  onSubmit() {  //Se ejecuta al enviar el formulario de registro y envía los datos al servidor
    const formData = this.signupForm.value;
    this.loading = true;

    const postData = {
      email: formData.user,
      password: formData.pass,
      name: formData.name,
      twoFA: formData.twoFA,
      role: formData.role
    };
    if (formData.user === '' || formData.pass === '' || formData.confirmPass === '' || formData.twoFA === '' || formData.role === '') {
      this.loading = false;
      this.openSnackBar('Debe ingresar todos los datos!');
      return;
    }
    if (formData.pass !== formData.confirmPass) {
      this.loading = false;
      this.openSnackBar('Las contraseñas no coinciden!');
      this.signupForm.patchValue({['confirmPass']: ''});
      return;
    }
    this.httpClient.post(`${environment.api_url}/auth/signup`, postData).subscribe((res: any) => {
      this.loading = false;
      this.cookieService.set('token', res.access_token);
      this.router.navigate(['/dashboard'], {
        queryParams: { newSession: true, tab: 'inventario' },
      });
    }, (error: any) => {
      this.loading = false;
      this.signupForm.patchValue({['pass']: ''});
      this.signupForm.patchValue({['confirmPass']: ''});
      this.signupForm.patchValue({['twoFA']: ''});
      if (error.status == 0) {
        this.openSnackBar('Error al conectar con el servidor');
        return;
      }
      this.openSnackBar(`${error.error.message}`);
    });
  }
  openSnackBar(message: string, action: string = 'Cerrar') { //Muestra un mensaje emergente en la parte inferior de la pantalla
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
