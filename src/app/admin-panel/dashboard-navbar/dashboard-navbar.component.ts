import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { DollarInputDialogComponent } from '../../dialogs/dollar-input-dialog/dollar-input-dialog.component';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.html',
})
export class DashboardNavbarComponent {
  dollar: number = Number(this.cookieService.get('dollar'));  //Obtiene el precio del dólar de la cookie

  constructor(
    private cookieService: CookieService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {  //Verifica si hay un precio del dólar en la cookie y si no lo hay, lo solicita
    if (!this.dollar) {
      this.changeDollar();
    }
  }

  changeDollar() {  //Abre el diálogo para ingresar el precio del dólar
    const dialogRef = this.dialog.open(DollarInputDialogComponent, {
      data: {title: 'Precio dólar', message: 'Ingrese el precio del dólar'},
      disableClose: true,
      width: '260px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cookieService.set('dollar', result);
      this.dollar = Number(this.cookieService.get('dollar'));
    });
  }
}

