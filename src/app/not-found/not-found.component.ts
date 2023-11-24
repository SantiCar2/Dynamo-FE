import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.html',
})
export class NotFoundComponent {
  returnToMain() {
    window.location.href = '/';
  }
}
