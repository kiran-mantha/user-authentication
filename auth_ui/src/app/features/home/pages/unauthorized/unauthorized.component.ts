import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['./unauthorized.component.scss'],
    standalone: true
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}