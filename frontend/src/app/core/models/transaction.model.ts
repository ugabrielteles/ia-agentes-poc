export interface Transaction {
  id?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string | Category;
  user?: string;
  date: string;
  tags?: string[];
  isPersonal: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFilter {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  isPersonal?: boolean;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
}

// Importar Category para resolver referência circular
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
