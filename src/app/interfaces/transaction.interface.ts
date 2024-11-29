export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: 'expense' | 'income';
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionDTO {
  wallet_id: string;
  type: 'expense' | 'income';
  amount: number;
  description?: string;
}

export interface UpdateTransactionDTO {
  wallet_id?: string;
  type?: 'expense' | 'income';
  amount?: number;
  description?: string;
}
