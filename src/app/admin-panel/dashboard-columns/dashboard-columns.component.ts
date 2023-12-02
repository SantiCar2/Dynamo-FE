import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableViewComponent } from '../table-view/table-view.component';

@Component({
  selector: 'app-dashboard-columns',
  standalone: true,
  imports: [CommonModule, TableViewComponent],
  templateUrl: './index.html',

})
export class DashboardColumnsComponent {

}
