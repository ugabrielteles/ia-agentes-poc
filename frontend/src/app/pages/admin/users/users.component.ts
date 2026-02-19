import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
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
            <h1 class="page-title">Gestão de Usuários</h1>
            <button mat-raised-button color="primary">
              <mat-icon>person_add</mat-icon>
              Novo Usuário
            </button>
          </div>

          <mat-card>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-center">
                <mat-spinner></mat-spinner>
              </div>

              <table *ngIf="!isLoading" mat-table [dataSource]="users" class="full-width">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Nome</th>
                  <td mat-cell *matCellDef="let u">{{ u.name }}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>E-mail</th>
                  <td mat-cell *matCellDef="let u">{{ u.email }}</td>
                </ng-container>

                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef>Role</th>
                  <td mat-cell *matCellDef="let u">
                    <mat-chip [style.background-color]="getRoleColor(u.role)">
                      {{ u.role }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef>Ativo</th>
                  <td mat-cell *matCellDef="let u">
                    <mat-slide-toggle
                      [checked]="u.isActive"
                      (change)="toggleUserStatus(u)"
                      [attr.aria-label]="u.isActive ? 'Desativar usuário' : 'Ativar usuário'"
                    ></mat-slide-toggle>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Ações</th>
                  <td mat-cell *matCellDef="let u">
                    <button mat-icon-button color="primary" aria-label="Editar usuário">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" aria-label="Excluir usuário">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <p *ngIf="!isLoading && users.length === 0" class="empty-state">
                Nenhum usuário encontrado
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
  `],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns = ['name', 'email', 'role', 'isActive', 'actions'];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http
      .get<User[]>(`${environment.apiUrl}/users`)
      .subscribe({
        next: (data) => {
          this.users = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  toggleUserStatus(user: User): void {
    this.http
      .patch(`${environment.apiUrl}/users/${user.id}`, {
        isActive: !user.isActive,
      })
      .subscribe({
        next: () => {
          user.isActive = !user.isActive;
        },
      });
  }

  getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      admin: '#ffebee',
      user: '#e8f5e9',
      company: '#e3f2fd',
    };
    return colors[role] || '#f5f5f5';
  }
}
