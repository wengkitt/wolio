import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  tap,
  throwError,
} from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.user.asObservable();

  constructor(private supabase: SupabaseService, private router: Router) {
    this.supabase.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.user.next(null);
        this.router.navigate(['/']);
      }
    });
  }

  getCurrentUser(): Observable<User | null> {
    return from(this.supabase.client.auth.getUser()).pipe(
      map((response) => response.data.user)
    );
  }

  signUp(email: string, password: string, name: string): Observable<any> {
    return from(
      this.supabase.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
    ).pipe(
      tap((response) => {
        if (response.data.user) {
          this.setUser(response.data.user);
        }
      })
    );
  }

  signIn(email: string, password: string): Observable<any> {
    return from(
      this.supabase.client.auth.signInWithPassword({
        email,
        password,
      })
    ).pipe(
      tap((response) => {
        if (response.error) {
          throw new Error(response.error.message || 'Sign-in failed');
        }

        if (response.data.user) {
          this.setUser(response.data.user);
        }
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.message || 'Failed to sign in.')
        );
      })
    );
  }

  signOut(): Observable<any> {
    return from(this.supabase.client.auth.signOut());
  }

  resetPassword(email: string): Observable<any> {
    return from(
      this.supabase.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/change-password`,
      })
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return from(
      this.supabase.client.rpc('change_user_password', {
        current_password: currentPassword,
        new_password: newPassword,
      })
    );
  }

  changePasswordAfterReset(newPassword: string): Observable<any> {
    return from(
      this.supabase.client.auth.updateUser({ password: newPassword })
    );
  }

  private setUser(user: User) {
    this.user.next({
      id: user.id,
      email: user.email!,
      name: user.user_metadata['name'],
    });
  }
}
