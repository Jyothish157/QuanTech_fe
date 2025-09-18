import { Injectable, computed, signal } from '@angular/core';

export type UserRole = 'employee' | 'manager';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this._currentUser());

  currentUser = this._currentUser.asReadonly();

  login(username: string, password: string, role: UserRole): boolean {
    // Mock validation. Replace with API call later.
    const ok = !!username && !!password;
    if (ok) {
      this._currentUser.set({
        id: Math.random().toString(36).substr(2, 9), // Mock ID
        username,
        role
      });
    }
    return ok;
  }

  logout(): void {
    this._currentUser.set(null);
  }
}


