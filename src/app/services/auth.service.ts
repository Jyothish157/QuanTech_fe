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
    // Default credentials for testing
    const validCredentials = {
      'emp': { password: 'emp123', role: 'employee' as UserRole },
      'mgnr': { password: 'mgnr123', role: 'manager' as UserRole }
    };

    const credential = validCredentials[username as keyof typeof validCredentials];
    const isValid = credential && credential.password === password && credential.role === role;
    
    if (isValid) {
      this._currentUser.set({
        id: Math.random().toString(36).substr(2, 9), // Mock ID
        username,
        role
      });
    }
    return isValid;
  }

  logout(): void {
    this._currentUser.set(null);
  }
}


