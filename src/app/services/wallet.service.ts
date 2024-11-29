import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, tap } from 'rxjs';
import {
  CreateWalletDTO,
  TransferDTO,
  Wallet,
  WalletTransfer,
} from '../interfaces/wallet.interface';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private wallets = new BehaviorSubject<Wallet[]>([]);
  wallets$ = this.wallets.asObservable();

  private transfers = new BehaviorSubject<WalletTransfer[]>([]);
  transfers$ = this.transfers.asObservable();

  constructor(private supabase: SupabaseService) {
    this.loadWallets();
    this.loadTransfers();
  }

  private loadWallets() {
    from(
      this.supabase.client
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false })
    ).subscribe({
      next: ({ data }) => {
        if (data) {
          this.wallets.next(data as Wallet[]);
        }
      },
    });
  }

  private loadTransfers() {
    from(
      this.supabase.client
        .from('wallet_transfers')
        .select('*')
        .order('created_at', { ascending: false })
    ).subscribe({
      next: ({ data }) => {
        if (data) {
          this.transfers.next(data as WalletTransfer[]);
        }
      },
    });
  }

  createWallet(dto: CreateWalletDTO): Observable<Wallet> {
    return from(
      this.supabase.client.from('wallets').insert([dto]).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Wallet;
      }),
      tap(() => this.loadWallets())
    );
  }

  transfer(dto: TransferDTO): Observable<WalletTransfer> {
    return from(
      this.supabase.client
        .from('wallet_transfers')
        .insert([dto])
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as WalletTransfer;
      }),
      tap(() => {
        this.loadWallets();
        this.loadTransfers();
      })
    );
  }

  getWalletById(id: string): Observable<Wallet | null> {
    return from(
      this.supabase.client.from('wallets').select().eq('id', id).single()
    ).pipe(map(({ data }) => (data as Wallet) || null));
  }

  getTransfersByWalletId(walletId: string): Observable<WalletTransfer[]> {
    return from(
      this.supabase.client
        .from('wallet_transfers')
        .select()
        .or(`from_wallet_id.eq.${walletId},to_wallet_id.eq.${walletId}`)
        .order('created_at', { ascending: false })
    ).pipe(map(({ data }) => (data as WalletTransfer[]) || []));
  }
}
