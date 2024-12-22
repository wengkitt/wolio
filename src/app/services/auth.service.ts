import { Injectable } from '@angular/core';
import { account, ID } from '../../lib/appwrite';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser: any = null;

  constructor() {}

  async login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    this.loggedInUser = await account.get();
  }

  async register(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name);
    this.login(email, password);
  }

  async logout() {
    await account.deleteSession('current');
    this.loggedInUser = null;
  }

  async isUserLoggedIn() {
    try {
      await account.get();
      return true;
    } catch (_) {
      return false;
    }
  }
}
