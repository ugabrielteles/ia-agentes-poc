import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil } from 'rxjs';
import { MenuService } from '../../../core/services/menu.service';
import { AuthService } from '../../../core/services/auth.service';
import { MenuConfig } from '../../../core/models/menu-config.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
  ],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <mat-icon>account_balance_wallet</mat-icon>
        <span>Gestão Financeira</span>
      </div>

      <mat-nav-list>
        <ng-container *ngFor="let menu of menus">
          <!-- Menu sem filhos -->
          <a
            *ngIf="!menu.children || menu.children.length === 0"
            mat-list-item
            [routerLink]="menu.route"
            routerLinkActive="active"
            [attr.aria-label]="menu.label"
          >
            <mat-icon matListItemIcon>{{ menu.icon }}</mat-icon>
            <span matListItemTitle>{{ menu.label }}</span>
          </a>

          <!-- Menu com submenus -->
          <mat-expansion-panel
            *ngIf="menu.children && menu.children.length > 0"
            class="sidebar-expansion"
          >
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>{{ menu.icon }}</mat-icon>
                <span>{{ menu.label }}</span>
              </mat-panel-title>
            </mat-expansion-panel-header>

            <mat-nav-list>
              <a
                *ngFor="let child of menu.children"
                mat-list-item
                [routerLink]="child.route"
                routerLinkActive="active"
                [attr.aria-label]="child.label"
              >
                <mat-icon matListItemIcon>{{ child.icon }}</mat-icon>
                <span matListItemTitle>{{ child.label }}</span>
              </a>
            </mat-nav-list>
          </mat-expansion-panel>
        </ng-container>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background-color: #1a237e;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 16px;
      background-color: #0d147a;
      font-size: 1.1rem;
      font-weight: 600;
    }

    mat-nav-list a.active {
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }

    .sidebar-expansion {
      background-color: transparent;
      box-shadow: none !important;
    }
  `],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menus: MenuConfig[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.menuService.menus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((menus) => {
        this.menus = menus;
      });

    this.menuService.loadMenus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
