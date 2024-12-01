import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  from,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  CreateWalletDTO,
  TransferDTO,
  Wallet,
  WalletTransfer,
} from '../interfaces/wallet.interface';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private wallets = new BehaviorSubject<Wallet[]>([]);
  wallets$ = this.wallets.asObservable();

  private transfers = new BehaviorSubject<WalletTransfer[]>([]);
  transfers$ = this.transfers.asObservable();

  constructor(
    private supabase: SupabaseService,
    private authService: AuthService
  ) {
    this.authService.user$
      .pipe(
        switchMap((user) => {
          if (user) {
            return from(
              Promise.all([
                this.loadWallets(user.id),
                this.loadTransfers(user.id),
              ])
            );
          }
          return from([]);
        })
      )
      .subscribe();
  }

  private async loadWallets(userId: string) {
    const { data, error } = await this.supabase.client
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    this.wallets.next(data as Wallet[]);
  }

  private async loadTransfers(userId: string) {
    const { data, error } = await this.supabase.client
      .from('transfers')
      .select(
        `
        *,
        from_wallet_name:wallets!transfers_from_wallet_id_fkey(name),
        to_wallet_name:wallets!transfers_to_wallet_id_fkey(name)
        `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log(data);
    this.transfers.next(data as WalletTransfer[]);
  }

  createWallet(dto: CreateWalletDTO): Observable<Wallet> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) throw new Error('User not authenticated');
        return from(
          this.supabase.client
            .from('wallets')
            .insert([{ ...dto, user_id: user.id }])
            .select()
            .single()
        ).pipe(
          map(({ data, error }) => {
            if (error) throw error;
            return data as Wallet;
          }),
          tap(() => this.loadWallets(user.id))
        );
      })
    );
  }

  transfer(dto: TransferDTO): Observable<WalletTransfer> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) throw new Error('User not authenticated');

        return from(
          this.supabase.client
            .from('transfers')
            .insert([{ ...dto, user_id: user.id }])
            .select()
            .single()
        ).pipe(
          map(({ data, error }) => {
            if (error) throw error;
            return data as WalletTransfer;
          }),
          switchMap((transfer) =>
            forkJoin([
              from(
                this.supabase.client
                  .from('wallets')
                  .select('balance')
                  .eq('id', dto.from_wallet_id)
                  .single()
              ).pipe(
                map(({ data, error }) => {
                  if (error) throw error;
                  return data?.balance || 0;
                })
              ),

              from(
                this.supabase.client
                  .from('wallets')
                  .select('balance')
                  .eq('id', dto.to_wallet_id)
                  .single()
              ).pipe(
                map(({ data, error }) => {
                  if (error) throw error;
                  return data?.balance || 0;
                })
              ),
            ]).pipe(
              switchMap(([fromAmount, toAmount]) => {
                if (fromAmount < dto.amount) {
                  throw new Error('Insufficient funds in the source wallet');
                }

                const newFromAmount = fromAmount - dto.amount;
                const newToAmount = toAmount + dto.amount;

                return forkJoin([
                  from(
                    this.supabase.client
                      .from('wallets')
                      .update({ balance: newFromAmount })
                      .eq('id', dto.from_wallet_id)
                  ),

                  from(
                    this.supabase.client
                      .from('wallets')
                      .update({ balance: newToAmount })
                      .eq('id', dto.to_wallet_id)
                  ),
                ]).pipe(
                  tap(([fromWalletUpdate, toWalletUpdate]) => {
                    if (fromWalletUpdate.error || toWalletUpdate.error) {
                      throw new Error(
                        `Wallet update failed: ${
                          fromWalletUpdate.error?.message || ''
                        } ${toWalletUpdate.error?.message || ''}`
                      );
                    }
                  }),
                  map(() => transfer)
                );
              })
            )
          ),
          tap(() => {
            this.loadWallets(user.id);
            this.loadTransfers(user.id);
          })
        );
      })
    );
  }
}
