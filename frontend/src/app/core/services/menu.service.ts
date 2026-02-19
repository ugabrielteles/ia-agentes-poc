import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuConfig } from '../models/menu-config.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu-config`;
  private menusSubject = new BehaviorSubject<MenuConfig[]>([]);

  menus$ = this.menusSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getMenuId(menu: MenuConfig): string | undefined {
    return menu.id || (menu as MenuConfig & { _id?: string })._id;
  }

  private getParentMenuId(menu: MenuConfig): string | undefined {
    if (!menu.parentMenu) {
      return undefined;
    }

    if (typeof menu.parentMenu === 'string') {
      return menu.parentMenu;
    }

    return this.getMenuId(menu.parentMenu);
  }

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
      const menuId = this.getMenuId(menu);
      if (!menuId) {
        return;
      }
      menuMap.set(menuId, { ...menu, id: menuId, children: [] });
    });

    // Organizar hierarquia
    menus.forEach((menu) => {
      const menuId = this.getMenuId(menu);
      if (!menuId) {
        return;
      }

      const menuItem = menuMap.get(menuId);
      if (!menuItem) {
        return;
      }

      const parentMenuId = this.getParentMenuId(menu);
      if (parentMenuId) {
        const parent = menuMap.get(parentMenuId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(menuItem);
        } else {
          rootMenus.push(menuItem);
        }
      } else {
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
