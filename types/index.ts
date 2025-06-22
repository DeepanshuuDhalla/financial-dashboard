export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  accountNumber: string;
  bank: string;
  isActive: boolean;
  creditLimit?: number;
}

export * from './transaction';
export * from './goal';
export * from './user';
export * from './analytics';
export { Account };
