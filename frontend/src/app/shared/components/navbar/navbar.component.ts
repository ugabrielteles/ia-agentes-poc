import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
  ],
  template: `
    <mat-toolbar color="primary" class="navbar" role="banner">
      <span class="flex-spacer"></span>

      <span class="user-info" *ngIf="currentUser$ | async as user">
        Olá, {{ user.name }}
        <mat-chip class="role-chip">{{ user.role }}</mat-chip>
      </span>

      <button
        mat-icon-button
        [matMenuTriggerFor]="userMenu"
        aria-label="Menu do usuário"
      >
        <mat-icon>account_circle</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>Sair</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .flex-spacer {
      flex: 1 1 auto;
    }

    .user-info {
      margin-right: 8px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .role-chip {
      font-size: 0.75rem;
      padding: 2px 8px;
      background-color: rgba(255,255,255,0.2);
      border-radius: 12px;
    }
  `],
})
export class NavbarComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
