export interface Category {
  id?: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
