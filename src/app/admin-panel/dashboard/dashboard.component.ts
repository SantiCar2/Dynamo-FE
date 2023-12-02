import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/environment';
import { ActivatedRoute, Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DashboardColumnsComponent } from '../dashboard-columns/dashboard-columns.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardNavbarComponent, DashboardColumnsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent  {
  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}

  token: string = this.cookieService.get('token');

  ngOnInit() {  
    this.route.queryParams.subscribe((params) => { //Verifica si hay un token en la cookie y si es válido
      if (this.token) {
        this.httpClient
          .post(`${environment.api_url}/auth/verify`, { token: this.token })
          .subscribe(
            (res: any) => {
              if (params['newSession'] != 'true') {
                const expDate = new Date(res.exp * 1000);
                const dualogRef = this.dialog.open(ConfirmDialogComponent, {
                  data: {
                    title: `Sesión activa de ${res.email}`,
                    message: `Su sesión se cerrará el ${expDate.toLocaleDateString()} a las ${expDate.toLocaleTimeString()}. ¿Desea continuar?`,
                  },
                });
                dualogRef.afterClosed().subscribe((result: boolean) => {
                  if (!result) {
                    this.cookieService.delete('token');
                    this.router.navigate(['/login']);
                  }
                });
              }
            },
            (error: any) => {
              this.cookieService.delete('token');
              this.router.navigate(['/login']);
            },
          );
      } else {
        this.router.navigate(['/login']);
      }
    });


    console.log('Dashboard si');
    
  }

  openSnackBar(message: string, action: string = 'Cerrar') {  //Muestra un mensaje emergente en la parte inferior de la pantalla
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
