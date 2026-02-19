export interface MenuPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}

export interface MenuConfig {
  id?: string;
  label: string;
  icon: string;
  route: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
  roles: string[];
  parentMenu?: string | MenuConfig;
  permissions: MenuPermissions;
  children?: MenuConfig[];
  createdAt?: string;
  updatedAt?: string;
}
