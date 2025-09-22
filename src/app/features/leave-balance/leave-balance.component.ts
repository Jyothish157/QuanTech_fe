import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DownloadService } from '../../services/download.service';
import { LeaveService } from '../../services/leave.service';
import { EmployeeService } from '../../services/employee.service';
import { LeaveBalance } from '../../models/leave.model';

@Component({
  selector: 'app-leave-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.css']
})
export class LeaveBalanceComponent {
  currentEmployee: any;
  activeTab: 'ledger' | 'history' = 'ledger';

  // Dummy ledger rows to visualize table like the mock
  ledgerRows: { dateRange: string; type: string; days: number; status: 'Approved' | 'Rejected' | 'Pending'; running: number }[] = [
    { dateRange: 'Jan 01 - Jan 01, 2025', type: 'Auto-Accrued', days: 1, status: 'Approved', running: 13 },
    { dateRange: 'Feb 01 - Feb 01, 2025', type: 'Auto-Accrued', days: 1, status: 'Approved', running: 14 },
    { dateRange: 'Mar 01 - Mar 01, 2025', type: 'Auto-Accrued', days: 1, status: 'Approved', running: 15 },
  ];

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private router: Router,
    private download: DownloadService
  ) {
    this.currentEmployee = this.employeeService.getCurrentUser();
  }

  get balances(): LeaveBalance[] {
    return this.currentEmployee ? 
      this.leaveService.getLeaveBalance(this.currentEmployee.EmployeeID) : [];
  }

  getTotalBalance(): number {
    return this.balances.reduce((total, balance) => total + balance.BalanceDays, 0);
  }

  getMaxBalance(): number {
    return Math.max(...this.balances.map(b => b.BalanceDays), 20);
  }

  getBalanceFor(type: string): number {
    const found = this.balances.find(b => b.LeaveType === type);
    return found ? found.BalanceDays : 0;
  }

  getPercent(type: string, allowance: number): number {
    const val = this.getBalanceFor(type);
    if (allowance <= 0) return 0;
    const p = (val / allowance) * 100;
    return Math.max(0, Math.min(100, Math.round(p)));
  }

  goToLeaveRequest(): void {
    this.router.navigate(['/leave-requests']);
  }

  openLeaveHistory(): void {
    this.router.navigate(['/leave-history']);
  }

  openCompanyPolicy(): void {
    this.router.navigate(['/company-policy']);
  }

  setTab(tab: 'ledger' | 'history'): void {
    this.activeTab = tab;
    if (tab === 'history') {
      this.openLeaveHistory();
    }
  }

  downloadReport(): void {
    const header = ['Date Range', 'Type', 'Days', 'Status', 'Running Balance'];
    const lines = [header.join(','), ...this.ledgerRows.map(r => [r.dateRange, r.type, String(r.days), r.status, String(r.running)].join(','))];
    this.download.downloadText(lines.join('\n'), 'leave-report.csv', 'text/csv;charset=utf-8');
  }
}


