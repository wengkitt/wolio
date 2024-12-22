import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { account } from '../../lib/appwrite';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch (_) {
      this.router.navigate(['']);
      return false;
    }
  }
}
