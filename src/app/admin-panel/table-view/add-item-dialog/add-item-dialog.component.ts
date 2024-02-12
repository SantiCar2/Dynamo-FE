import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { InventoryAddComponent } from './inventory-add/inventory-add.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { TransactionAddComponent } from './transaction-add/transaction-add.component';

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ProductAddComponent, InventoryAddComponent, TransactionAddComponent],
  templateUrl: './add-item-dialog.component.html',
})
export class AddItemDialogComponent implements OnInit {
  inventory: boolean = false;
  product: boolean = false;
  transaction: boolean = false;

  constructor(public route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['tab'] === 'inventario') {
        this.inventory = true;
      } else if (params['tab'] === 'productos') {
        this.product = true;
      } else if (params['tab'] === 'transacciones') {
        this.transaction = true;
      }
    });
  }
}
