import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
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
            <h1 class="page-title">Transações</h1>
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Nova Transação
            </button>
          </div>

          <mat-card>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-center">
                <mat-spinner></mat-spinner>
              </div>

              <table *ngIf="!isLoading" mat-table [dataSource]="transactions" class="full-width">
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef>Tipo</th>
                  <td mat-cell *matCellDef="let t">
                    <mat-icon [style.color]="t.type === 'income' ? '#4caf50' : '#f44336'">
                      {{ t.type === 'income' ? 'arrow_upward' : 'arrow_downward' }}
                    </mat-icon>
                  </td>
                </ng-container>

                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Descrição</th>
                  <td mat-cell *matCellDef="let t">{{ t.description }}</td>
                </ng-container>

                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Valor</th>
                  <td mat-cell *matCellDef="let t"
                    [style.color]="t.type === 'income' ? '#4caf50' : '#f44336'">
                    {{ (t.type === 'income' ? '+' : '-') + (t.amount | currency:'BRL') }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Data</th>
                  <td mat-cell *matCellDef="let t">{{ t.date | date:'dd/MM/yyyy' }}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Ações</th>
                  <td mat-cell *matCellDef="let t">
                    <button mat-icon-button color="primary" aria-label="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" aria-label="Excluir">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <p *ngIf="!isLoading && transactions.length === 0" class="empty-state">
                Nenhuma transação encontrada
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
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  displayedColumns = ['type', 'description', 'amount', 'date', 'actions'];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.http
      .get<Transaction[]>(`${environment.apiUrl}/transactions`)
      .subscribe({
        next: (data) => {
          this.transactions = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
