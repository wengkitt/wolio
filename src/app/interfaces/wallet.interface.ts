export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransfer {
  id: string;
  user_id: string;
  from_wallet_id: string;
  to_wallet_id: string;
  amount: number;
  created_at: string;
}

export interface CreateWalletDTO {
  name: string;
  initial_balance: number;
}

export interface TransferDTO {
  from_wallet_id: string;
  to_wallet_id: string;
  amount: number;
}
