import { Injectable, computed, signal, inject } from '@angular/core';
import { EmployeeService } from './employee.service';

export type UserRole = 'employee' | 'manager';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  employeeId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private employeeService = inject(EmployeeService);
  
  isAuthenticated = computed(() => !!this._currentUser());
  currentUser = this._currentUser.asReadonly();

  login(username: string, password: string, role: UserRole): boolean {
    // Check against employee data
    const employee = this.employeeService.getEmployeeByCredentials(username, password);
    
    if (employee && employee.Role.toLowerCase() === role) {
      this._currentUser.set({
        id: employee.EmployeeID,
        username: employee.Username || username,
        role: role,
        employeeId: employee.EmployeeID
      });
      return true;
    }

    // Fallback to default credentials for testing
    const validCredentials = {
      'emp': { password: 'emp123', role: 'employee' as UserRole, employeeId: 'E1001' },
      'mgnr': { password: 'mgnr123', role: 'manager' as UserRole, employeeId: 'E1002' }
    };

    const credential = validCredentials[username as keyof typeof validCredentials];
    const isValid = credential && credential.password === password && credential.role === role;
    
    if (isValid) {
      this._currentUser.set({
        id: credential.employeeId,
        username,
        role,
        employeeId: credential.employeeId
      });
    }
    return isValid;
  }

  logout(): void {
    this._currentUser.set(null);
  }

  getCurrentEmployeeId(): string | null {
    return this._currentUser()?.employeeId || null;
  }
}


