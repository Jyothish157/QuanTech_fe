import { Injectable, signal } from '@angular/core';
import { LeaveBalance, LeaveRequest, LeaveType } from '../models/leave.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly REQUESTS_KEY = 'lams_leave_requests';
  private readonly BALANCE_KEY = 'lams_leave_balance';
  
  private requestsSignal = signal<LeaveRequest[]>([]);
  private balanceSignal = signal<LeaveBalance[]>([]);

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultBalances();
    this.initializeSampleLeaveRequests();
  }

  private loadFromStorage(): void {
    const storedRequests = localStorage.getItem(this.REQUESTS_KEY);
    if (storedRequests) {
      this.requestsSignal.set(JSON.parse(storedRequests));
    }

    const storedBalance = localStorage.getItem(this.BALANCE_KEY);
    if (storedBalance) {
      this.balanceSignal.set(JSON.parse(storedBalance));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(this.requestsSignal()));
    localStorage.setItem(this.BALANCE_KEY, JSON.stringify(this.balanceSignal()));
  }

  private initializeDefaultBalances(): void {
    // Clear existing data to ensure fresh sample data
    localStorage.removeItem(this.BALANCE_KEY);
    if (this.balanceSignal().length === 0) {
      const defaultBalances: LeaveBalance[] = [];
      const employeeIds = ['E1001', 'E1002', 'E1003', 'E1004', 'E1005', 'E1006', 'E1007', 'E1008', 'E1009', 'E1010', 'E1011', 'E1012', 'E1013', 'E1014', 'E1015'];
      const leaveTypes: LeaveType[] = ['Sick', 'Vacation', 'Casual'];
      
      employeeIds.forEach(employeeId => {
        leaveTypes.forEach(leaveType => {
          defaultBalances.push({
            EmployeeID: employeeId,
            LeaveType: leaveType,
            BalanceDays: leaveType === 'Sick' ? 10 : leaveType === 'Vacation' ? 15 : 5
          });
        });
      });
      
      this.balanceSignal.set(defaultBalances);
      this.saveToStorage();
    }
  }

  getLeaveRequests(): LeaveRequest[] {
    return this.requestsSignal();
  }

  getLeaveBalance(employeeId: string): LeaveBalance[] {
    return this.balanceSignal().filter(b => b.EmployeeID === employeeId);
  }

  submitRequest(employeeId: string, leaveType: LeaveType, startDate: string, endDate: string, reason?: string): boolean {
    // Check if employee has sufficient balance
    const balance = this.getLeaveBalance(employeeId).find(b => b.LeaveType === leaveType);
    if (!balance || balance.BalanceDays <= 0) {
      return false;
    }

    const request: LeaveRequest = {
      LeaveID: this.generateId(),
      EmployeeID: employeeId,
      LeaveType: leaveType,
      StartDate: startDate,
      EndDate: endDate,
      Status: 'Pending',
      Reason: reason
    };

    this.requestsSignal.update(list => [request, ...list]);
    this.saveToStorage();
    return true;
  }

  approveRequest(leaveId: string): void {
    this.requestsSignal.update(list => 
      list.map(req => {
        if (req.LeaveID === leaveId) {
          const approvedReq = { ...req, Status: 'Approved' as const };
          this.updateLeaveBalance(approvedReq);
          return approvedReq;
        }
        return req;
      })
    );
    this.saveToStorage();
  }

  rejectRequest(leaveId: string): void {
    this.requestsSignal.update(list => 
      list.map(req => req.LeaveID === leaveId ? { ...req, Status: 'Rejected' as const } : req)
    );
    this.saveToStorage();
  }

  private updateLeaveBalance(approvedRequest: LeaveRequest): void {
    const startDate = new Date(approvedRequest.StartDate);
    const endDate = new Date(approvedRequest.EndDate);
    const daysRequested = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    this.balanceSignal.update(list => 
      list.map(balance => {
        if (balance.EmployeeID === approvedRequest.EmployeeID && balance.LeaveType === approvedRequest.LeaveType) {
          return { ...balance, BalanceDays: Math.max(0, balance.BalanceDays - daysRequested) };
        }
        return balance;
      })
    );
  }

  private initializeSampleLeaveRequests(): void {
    // Clear existing data to ensure fresh sample data
    localStorage.removeItem(this.REQUESTS_KEY);
    if (this.requestsSignal().length === 0) {
      const sampleRequests: LeaveRequest[] = [
        {
          LeaveID: 'LR001',
          EmployeeID: 'E1001',
          LeaveType: 'Vacation',
          StartDate: '2024-12-20',
          EndDate: '2024-12-22',
          Status: 'Approved',
          Reason: 'Family vacation'
        },
        {
          LeaveID: 'LR002',
          EmployeeID: 'E1003',
          LeaveType: 'Sick',
          StartDate: '2024-12-15',
          EndDate: '2024-12-15',
          Status: 'Approved',
          Reason: 'Flu'
        },
        {
          LeaveID: 'LR003',
          EmployeeID: 'E1004',
          LeaveType: 'Casual',
          StartDate: '2024-12-18',
          EndDate: '2024-12-18',
          Status: 'Pending',
          Reason: 'Personal work'
        },
        {
          LeaveID: 'LR004',
          EmployeeID: 'E1006',
          LeaveType: 'Vacation',
          StartDate: '2024-12-25',
          EndDate: '2024-12-27',
          Status: 'Pending',
          Reason: 'Holiday break'
        },
        {
          LeaveID: 'LR005',
          EmployeeID: 'E1008',
          LeaveType: 'Sick',
          StartDate: '2024-12-12',
          EndDate: '2024-12-13',
          Status: 'Approved',
          Reason: 'Medical appointment'
        },
        {
          LeaveID: 'LR006',
          EmployeeID: 'E1010',
          LeaveType: 'Casual',
          StartDate: '2024-12-19',
          EndDate: '2024-12-19',
          Status: 'Rejected',
          Reason: 'Personal event'
        },
        {
          LeaveID: 'LR007',
          EmployeeID: 'E1012',
          LeaveType: 'Vacation',
          StartDate: '2024-12-30',
          EndDate: '2025-01-03',
          Status: 'Pending',
          Reason: 'New Year vacation'
        },
        {
          LeaveID: 'LR008',
          EmployeeID: 'E1014',
          LeaveType: 'Sick',
          StartDate: '2024-12-16',
          EndDate: '2024-12-16',
          Status: 'Approved',
          Reason: 'Doctor visit'
        }
      ];
      this.requestsSignal.set(sampleRequests);
      this.saveToStorage();
    }
  }

  private generateId(): string {
    return 'LR' + Date.now().toString();
  }
}


