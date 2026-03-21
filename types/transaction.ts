export interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionFormData = Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;

export const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Income',
  'Other',
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];