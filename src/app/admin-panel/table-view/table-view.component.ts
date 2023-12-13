import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { environment } from '../../../environment/environment';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css',
})
export class TableViewComponent implements AfterViewInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();
  selectedRow: any;
  isLoading: boolean = true;
  error: boolean = false;
  inputValue: string = '';

  lastTab: string = '';

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
    private dialog: MatDialog,
  ) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['tab'] == undefined) {
        return;
      }
      if (params['tab'] != this.lastTab) {
        this.inputValue = '';
        this.isLoading = true;
        this.dataSource.data = [];
        this.displayedColumns = [];
        this.httpClient
          .get(`${environment.api_url}/data/${params['tab']}Table`, {
            headers: new HttpHeaders({
              Authorization: `Bearer ${this.cookieService.get('token')}` || '',
            }),
          })
          .subscribe(
            (res: any) => {
              if (JSON.stringify(res) == '[]') {
                this.displayedColumns = [`No hay datos en ${params['tab']}`];
              } else {
                this.dataSource = new MatTableDataSource(res);
                this.displayedColumns = Object.keys(res[0]);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              }
              this.isLoading = false;
              this.error = false;
            },
            (error: any) => {
              if (error.status == '401') {
                this.openSnackBar('No autorizado, se redirigirá al login');
                this.cookieService.delete('token');
                setTimeout(() => {
                  window.location.href = '/login';
                }, 7000);
              } else {
                this.openSnackBar('Error al cargar los datos');
                this.displayedColumns = ['Error al cargar los datos'];
                this.error = true;
                this.isLoading = false;
              }
            },
          );
        this.lastTab = params['tab'];
      }
    });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  selectRow(row: any) {
    if (this.selectedRow == row) {
      this.selectedRow = null;
      return;
    }
    this.selectedRow = row;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addItem() {
    const addItem = this.dialog.open(AddItemDialogComponent);
    addItem.afterClosed().subscribe((result) => {});
  }

  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
