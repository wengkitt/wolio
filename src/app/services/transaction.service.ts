import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, tap } from 'rxjs';
import { SupabaseService } from './supabase.service';
import {
  CreateTransactionDTO,
  Transaction,
  UpdateTransactionDTO,
} from '../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactions = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactions.asObservable();

  constructor(private supabase: SupabaseService) {
    this.loadTransactions();
  }

  private loadTransactions() {
    from(
      this.supabase.client
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
    ).subscribe({
      next: ({ data }) => {
        if (data) {
          this.transactions.next(data as Transaction[]);
        }
      },
    });
  }

  createTransaction(dto: CreateTransactionDTO): Observable<Transaction> {
    return from(
      this.supabase.client.from('transactions').insert([dto]).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Transaction;
      }),
      tap(() => this.loadTransactions())
    );
  }

  updateTransaction(
    id: string,
    dto: UpdateTransactionDTO
  ): Observable<Transaction> {
    return from(
      this.supabase.client
        .from('transactions')
        .update(dto)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Transaction;
      }),
      tap(() => this.loadTransactions())
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return from(
      this.supabase.client.from('transactions').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      tap(() => this.loadTransactions())
    );
  }

  getTransactionsByWalletId(walletId: string): Observable<Transaction[]> {
    return from(
      this.supabase.client
        .from('transactions')
        .select()
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false })
    ).pipe(map(({ data }) => (data as Transaction[]) || []));
  }

  getTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<Transaction[]> {
    return from(
      this.supabase.client
        .from('transactions')
        .select()
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })
    ).pipe(map(({ data }) => (data as Transaction[]) || []));
  }
}
