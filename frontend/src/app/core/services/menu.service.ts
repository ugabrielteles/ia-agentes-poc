import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuConfig } from '../models/menu-config.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu-config`;
  private menusSubject = new BehaviorSubject<MenuConfig[]>([]);

  menus$ = this.menusSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Carrega os menus disponíveis para o usuário atual baseado no seu role
   */
  loadMenus(): void {
    this.http.get<MenuConfig[]>(`${this.apiUrl}/my-menus`).subscribe({
      next: (menus) => {
        const organized = this.organizeMenuHierarchy(menus);
        this.menusSubject.next(organized);
      },
      error: (err) => {
        console.error('Erro ao carregar menus:', err);
        this.menusSubject.next([]);
      },
    });
  }

  /**
   * Retorna todos os menus (apenas para admin)
   */
  getAllMenus(): Observable<MenuConfig[]> {
    return this.http.get<MenuConfig[]>(this.apiUrl);
  }

  /**
   * Organiza os menus em hierarquia pai/filho
   */
  private organizeMenuHierarchy(menus: MenuConfig[]): MenuConfig[] {
    const menuMap = new Map<string, MenuConfig>();
    const rootMenus: MenuConfig[] = [];

    // Mapear todos os menus por ID
    menus.forEach((menu) => {
      menuMap.set(menu.id!, { ...menu, children: [] });
    });

    // Organizar hierarquia
    menus.forEach((menu) => {
      const menuItem = menuMap.get(menu.id!)!;
      if (menu.parentMenu && typeof menu.parentMenu === 'string') {
        const parent = menuMap.get(menu.parentMenu);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(menuItem);
        }
      } else if (!menu.parentMenu) {
        rootMenus.push(menuItem);
      }
    });

    return rootMenus.sort((a, b) => a.order - b.order);
  }

  /**
   * Filtra menus pelo role do usuário
   */
  filterMenusByRole(menus: MenuConfig[], role: string): MenuConfig[] {
    return menus.filter(
      (menu) =>
        menu.isActive &&
        menu.isVisible &&
        menu.roles.includes(role),
    );
  }

  clearMenus(): void {
    this.menusSubject.next([]);
  }
}
