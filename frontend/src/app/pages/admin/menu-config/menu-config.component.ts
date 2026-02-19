import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { environment } from '../../../../environments/environment';
import { MenuConfig } from '../../../core/models/menu-config.model';

@Component({
  selector: 'app-menu-config',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SidebarComponent,
    NavbarComponent,
  ],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-navbar></app-navbar>
        <div class="page-content">
          <div class="page-header">
            <h1 class="page-title">Configuração de Menus</h1>
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Novo Menu
            </button>
          </div>

          <mat-card>
            <mat-card-header>
              <mat-card-subtitle>
                <mat-icon>drag_indicator</mat-icon>
                Arraste os itens para reordenar os menus
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-center">
                <mat-spinner></mat-spinner>
              </div>

              <table
                *ngIf="!isLoading"
                mat-table
                [dataSource]="menus"
                cdkDropList
                (cdkDropListDropped)="onDrop($event)"
                class="full-width"
              >
                <!-- Coluna de drag -->
                <ng-container matColumnDef="drag">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let m" class="drag-handle">
                    <mat-icon cdkDragHandle>drag_indicator</mat-icon>
                  </td>
                </ng-container>

                <!-- Ícone -->
                <ng-container matColumnDef="icon">
                  <th mat-header-cell *matHeaderCellDef>Ícone</th>
                  <td mat-cell *matCellDef="let m">
                    <mat-icon>{{ m.icon }}</mat-icon>
                  </td>
                </ng-container>

                <!-- Label -->
                <ng-container matColumnDef="label">
                  <th mat-header-cell *matHeaderCellDef>Rótulo</th>
                  <td mat-cell *matCellDef="let m">{{ m.label }}</td>
                </ng-container>

                <!-- Rota -->
                <ng-container matColumnDef="route">
                  <th mat-header-cell *matHeaderCellDef>Rota</th>
                  <td mat-cell *matCellDef="let m">
                    <code>{{ m.route }}</code>
                  </td>
                </ng-container>

                <!-- Ordem -->
                <ng-container matColumnDef="order">
                  <th mat-header-cell *matHeaderCellDef>Ordem</th>
                  <td mat-cell *matCellDef="let m">{{ m.order }}</td>
                </ng-container>

                <!-- Roles -->
                <ng-container matColumnDef="roles">
                  <th mat-header-cell *matHeaderCellDef>Roles</th>
                  <td mat-cell *matCellDef="let m">
                    <mat-chip *ngFor="let role of m.roles"
                      [style.background-color]="getRoleColor(role)"
                      class="role-chip">
                      {{ role }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Ativo -->
                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef>Ativo</th>
                  <td mat-cell *matCellDef="let m">
                    <mat-slide-toggle
                      [checked]="m.isActive"
                      (change)="toggleActive(m)"
                      [attr.aria-label]="m.isActive ? 'Desativar menu' : 'Ativar menu'"
                    ></mat-slide-toggle>
                  </td>
                </ng-container>

                <!-- Visível -->
                <ng-container matColumnDef="isVisible">
                  <th mat-header-cell *matHeaderCellDef>Visível</th>
                  <td mat-cell *matCellDef="let m">
                    <mat-slide-toggle
                      [checked]="m.isVisible"
                      (change)="toggleVisible(m)"
                      [attr.aria-label]="m.isVisible ? 'Ocultar menu' : 'Exibir menu'"
                    ></mat-slide-toggle>
                  </td>
                </ng-container>

                <!-- Ações -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Ações</th>
                  <td mat-cell *matCellDef="let m">
                    <button mat-icon-button color="primary"
                      [matTooltip]="'Editar ' + m.label"
                      aria-label="Editar menu">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn"
                      [matTooltip]="'Excluir ' + m.label"
                      aria-label="Excluir menu">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns;"
                  cdkDrag
                  [cdkDragData]="row"
                  class="drag-row"
                ></tr>
              </table>

              <p *ngIf="!isLoading && menus.length === 0" class="empty-state">
                Nenhum menu configurado
              </p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; }
    .main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
    .page-content { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-title { font-size: 1.8rem; font-weight: 600; color: #1a237e; margin: 0; }
    .full-width { width: 100%; }
    .loading-center { display: flex; justify-content: center; padding: 48px; }
    .empty-state { text-align: center; color: #999; padding: 24px; }
    .drag-handle { cursor: grab; color: #999; }
    .drag-row:hover { background-color: #f5f5f5; }
    .cdk-drag-preview { box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .cdk-drag-placeholder { opacity: 0.4; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .role-chip { font-size: 0.75rem; margin: 2px; }
    code { background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: 0.85rem; }
  `],
})
export class MenuConfigComponent implements OnInit {
  menus: MenuConfig[] = [];
  displayedColumns = ['drag', 'icon', 'label', 'route', 'order', 'roles', 'isActive', 'isVisible', 'actions'];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.http
      .get<MenuConfig[]>(`${environment.apiUrl}/menu-config`)
      .subscribe({
        next: (data) => {
          this.menus = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onDrop(event: CdkDragDrop<MenuConfig[]>): void {
    moveItemInArray(this.menus, event.previousIndex, event.currentIndex);

    // Atualizar a ordem de todos os menus
    const reorderData = this.menus.map((menu, index) => ({
      id: menu.id!,
      order: index,
    }));

    this.http
      .patch(`${environment.apiUrl}/menu-config/reorder`, reorderData)
      .subscribe({
        next: () => {
          this.menus = this.menus.map((menu, index) => ({
            ...menu,
            order: index,
          }));
        },
      });
  }

  toggleActive(menu: MenuConfig): void {
    this.http
      .patch(`${environment.apiUrl}/menu-config/${menu.id}`, {
        isActive: !menu.isActive,
      })
      .subscribe({
        next: () => {
          menu.isActive = !menu.isActive;
        },
      });
  }

  toggleVisible(menu: MenuConfig): void {
    this.http
      .patch(`${environment.apiUrl}/menu-config/${menu.id}`, {
        isVisible: !menu.isVisible,
      })
      .subscribe({
        next: () => {
          menu.isVisible = !menu.isVisible;
        },
      });
  }

  getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      admin: '#ffcdd2',
      user: '#c8e6c9',
      company: '#bbdefb',
    };
    return colors[role] || '#f5f5f5';
  }
}
