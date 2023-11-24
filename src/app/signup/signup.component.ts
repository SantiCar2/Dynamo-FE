import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
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
    this.signupForm = this.fb.group({
      user: '',
      pass: '',
      confirmPass: '',
      name: '',
      twoFA: ''
    });
  }

  onSubmit() {
    const formData = this.signupForm.value;
    this.loading = true;

    const postData = {
      email: formData.user,
      password: formData.pass,
      name: formData.name,
      twoFA: formData.twoFA
    };
    if (formData.user === '' || formData.pass === '' || formData.confirmPass === '' || formData.twoFA === '') {
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
      this.router.navigate(['/dashboard']);
    }, (error: any) => {
      this.loading = false;
      this.signupForm.patchValue({['pass']: ''});
      this.signupForm.patchValue({['confirmPass']: ''});
      this.signupForm.patchValue({['twoFA']: ''});
      console.log(error);
      this.openSnackBar(`Error: ${error.error.message}`);
    });
  }
  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
