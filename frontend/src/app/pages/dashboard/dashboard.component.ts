import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    SidebarComponent,
    NavbarComponent,
  ],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>

      <div class="main-content">
        <app-navbar></app-navbar>

        <div class="page-content">
          <h1 class="page-title">Dashboard</h1>

          <div *ngIf="isLoading" class="loading-center">
            <mat-spinner></mat-spinner>
          </div>

          <div *ngIf="!isLoading" class="dashboard-grid">
            <!-- Cards de resumo -->
            <mat-card class="summary-card income">
              <mat-card-content>
                <div class="card-icon">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="card-info">
                  <span class="card-label">Receitas do Mês</span>
                  <span class="card-value">{{ summary.income | currency:'BRL' }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="summary-card expense">
              <mat-card-content>
                <div class="card-icon">
                  <mat-icon>trending_down</mat-icon>
                </div>
                <div class="card-info">
                  <span class="card-label">Despesas do Mês</span>
                  <span class="card-value">{{ summary.expense | currency:'BRL' }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="summary-card balance" [class.negative]="summary.balance < 0">
              <mat-card-content>
                <div class="card-icon">
                  <mat-icon>account_balance</mat-icon>
                </div>
                <div class="card-info">
                  <span class="card-label">Saldo</span>
                  <span class="card-value">{{ summary.balance | currency:'BRL' }}</span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Últimas transações -->
          <mat-card *ngIf="!isLoading" class="transactions-card">
            <mat-card-header>
              <mat-card-title>Últimas Transações</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-list *ngIf="lastTransactions.length > 0">
                <mat-list-item *ngFor="let t of lastTransactions">
                  <mat-icon matListItemIcon [style.color]="t.type === 'income' ? '#4caf50' : '#f44336'">
                    {{ t.type === 'income' ? 'arrow_upward' : 'arrow_downward' }}
                  </mat-icon>
                  <span matListItemTitle>{{ t.description }}</span>
                  <span matListItemLine>{{ t.date | date:'dd/MM/yyyy' }}</span>
                  <span matListItemMeta [style.color]="t.type === 'income' ? '#4caf50' : '#f44336'">
                    {{ (t.type === 'income' ? '+' : '-') + (t.amount | currency:'BRL') }}
                  </span>
                </mat-list-item>
              </mat-list>
              <p *ngIf="lastTransactions.length === 0" class="empty-state">
                Nenhuma transação encontrada
              </p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .page-content {
      padding: 24px;
    }

    .page-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: #1a237e;
      margin-bottom: 24px;
    }

    .loading-center {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
    }

    .card-icon mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .card-label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 4px;
    }

    .card-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .summary-card.income .card-icon mat-icon { color: #4caf50; }
    .summary-card.expense .card-icon mat-icon { color: #f44336; }
    .summary-card.balance .card-icon mat-icon { color: #2196f3; }
    .summary-card.balance.negative .card-value { color: #f44336; }

    .transactions-card { margin-top: 8px; }

    .empty-state {
      text-align: center;
      color: #999;
      padding: 24px;
    }
  `],
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  summary = { income: 0, expense: 0, balance: 0 };
  lastTransactions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.http
      .get<any>(`${environment.apiUrl}/reports/dashboard`)
      .subscribe({
        next: (data) => {
          this.summary = data.currentMonth;
          this.lastTransactions = data.lastTransactions;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
