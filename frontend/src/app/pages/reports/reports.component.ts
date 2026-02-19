import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    SidebarComponent,
    NavbarComponent,
  ],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-navbar></app-navbar>
        <div class="page-content">
          <h1 class="page-title">Relatórios</h1>

          <div class="reports-grid">
            <mat-card class="report-card">
              <mat-card-header>
                <mat-icon mat-card-avatar color="primary">bar_chart</mat-icon>
                <mat-card-title>Resumo Mensal</mat-card-title>
                <mat-card-subtitle>Receitas e despesas por mês</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>Visualize o comparativo de receitas e despesas ao longo do ano.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="report-card">
              <mat-card-header>
                <mat-icon mat-card-avatar color="accent">pie_chart</mat-icon>
                <mat-card-title>Por Categoria</mat-card-title>
                <mat-card-subtitle>Distribuição por categoria</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>Analise como seus gastos estão distribuídos entre as categorias.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; }
    .main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
    .page-content { padding: 24px; }
    .page-title { font-size: 1.8rem; font-weight: 600; color: #1a237e; margin-bottom: 24px; }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .report-card { cursor: pointer; transition: box-shadow 0.2s; }
    .report-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  `],
})
export class ReportsComponent {}
