import { Injectable, signal } from '@angular/core';
import { LeaveBalanceItem, LeaveRequest, LeaveType } from '../models/leave.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  balances = signal<LeaveBalanceItem[]>([
    { type: 'Sick', balanceDays: 9 },
    { type: 'Vacation', balanceDays: 12 },
    { type: 'Casual', balanceDays: 3 },
  ]);

  requests = signal<LeaveRequest[]>([
    { created: new Date().toLocaleDateString(), type: 'Vacation', from: '2025-09-20', to: '2025-09-22', status: 'Pending' }
  ]);

  submitRequest(type: LeaveType, from: string, to: string, reason?: string) {
    const req: LeaveRequest = { created: new Date().toLocaleDateString(), type, from, to, status: 'Pending', reason };
    this.requests.update(list => [req, ...list]);
  }
}


