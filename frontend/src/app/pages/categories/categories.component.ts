import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { environment } from '../../../environments/environment';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
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
            <h1 class="page-title">Categorias</h1>
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Nova Categoria
            </button>
          </div>

          <mat-card>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-center">
                <mat-spinner></mat-spinner>
              </div>

              <div *ngIf="!isLoading" class="categories-grid">
                <mat-card
                  *ngFor="let cat of categories"
                  class="category-card"
                  [style.border-left]="'4px solid ' + cat.color"
                >
                  <mat-card-content>
                    <div class="category-header">
                      <mat-icon [style.color]="cat.color">{{ cat.icon }}</mat-icon>
                      <span class="category-name">{{ cat.name }}</span>
                    </div>
                    <mat-chip [style.background-color]="getTypeColor(cat.type)">
                      {{ getTypeLabel(cat.type) }}
                    </mat-chip>
                  </mat-card-content>
                </mat-card>
              </div>

              <p *ngIf="!isLoading && categories.length === 0" class="empty-state">
                Nenhuma categoria encontrada
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
    .loading-center { display: flex; justify-content: center; padding: 48px; }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .category-card { cursor: pointer; }
    .category-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .category-name { font-weight: 500; }
    .empty-state { text-align: center; color: #999; padding: 24px; }
  `],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http
      .get<Category[]>(`${environment.apiUrl}/categories`)
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      income: 'Receita',
      expense: 'Despesa',
      both: 'Ambos',
    };
    return labels[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      income: '#e8f5e9',
      expense: '#ffebee',
      both: '#e3f2fd',
    };
    return colors[type] || '#f5f5f5';
  }
}
