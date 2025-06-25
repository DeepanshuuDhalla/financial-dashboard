export interface Account {
  id: string | number;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  accountNumber: string;
  bank: string;
  isActive: boolean;
  creditLimit?: number;
}

export interface Transaction {
  id: string | number;
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  time: string;
  status: string;
  recurring: boolean;
  account: string;
  merchant: string;
  type: string;
}

export interface Goal {
  id: string | number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  monthlyTarget: number;
  createdDate: string;
  archivedDate?: string;
  archiveReason?: string;
  progress?: number;
  daysOverdue?: number;
}
