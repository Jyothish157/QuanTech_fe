import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DownloadService } from '../../services/download.service';
import { LeaveService } from '../../services/leave.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
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

  // Enhanced dummy history data
  historyRows: { dateRange: string; type: string; days: number; status: 'Approved' | 'Rejected' | 'Pending'; reason: string }[] = [
    { dateRange: 'Dec 20 - Dec 31, 2024', type: 'Vacation Leave', days: 10, status: 'Approved', reason: 'Year-end holidays' },
    { dateRange: 'Nov 15 - Nov 15, 2024', type: 'Sick Leave', days: 1, status: 'Approved', reason: 'Medical appointment' },
    { dateRange: 'Oct 05 - Oct 06, 2024', type: 'Casual Leave', days: 2, status: 'Approved', reason: 'Personal work' },
    { dateRange: 'Sep 23 - Sep 25, 2024', type: 'Sick Leave', days: 3, status: 'Approved', reason: 'Fever and flu' },
    { dateRange: 'Aug 10 - Aug 12, 2024', type: 'Vacation Leave', days: 3, status: 'Rejected', reason: 'Project deadline conflict' },
    { dateRange: 'Jul 22 - Jul 23, 2024', type: 'Casual Leave', days: 2, status: 'Approved', reason: 'Family event' },
    { dateRange: 'Jun 15 - Jun 17, 2024', type: 'Sick Leave', days: 3, status: 'Approved', reason: 'Medical treatment' },
    { dateRange: 'May 20 - May 31, 2024', type: 'Vacation Leave', days: 12, status: 'Approved', reason: 'Summer vacation' }
  ];

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private router: Router,
    private download: DownloadService,
    private auth: AuthService
  ) {
    const currentEmployeeId = this.auth.getCurrentEmployeeId() || 'E1001';
    this.currentEmployee = this.employeeService.getEmployee(currentEmployeeId);
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
    if (found) return found.BalanceDays;
    
    // Default values for demo purposes
    switch(type) {
      case 'Sick': return 8;
      case 'Casual': return 10;
      case 'Vacation': return 13;
      default: return 0;
    }
  }

  getPercent(type: string, allowance: number): number {
    const val = this.getBalanceFor(type);
    if (allowance <= 0) return 0;
    const p = (val / allowance) * 100;
    return Math.max(0, Math.min(100, Math.round(p)));
  }

  // Calculate percentage for CSS conic-gradient
  getSickPercent(): number {
    const total = this.getBalanceFor('Sick') + this.getBalanceFor('Casual') + this.getBalanceFor('Vacation');
    return total > 0 ? Math.round((this.getBalanceFor('Sick') / total) * 100) : 33;
  }

  getCasualPercent(): number {
    const total = this.getBalanceFor('Sick') + this.getBalanceFor('Casual') + this.getBalanceFor('Vacation');
    return total > 0 ? Math.round((this.getBalanceFor('Casual') / total) * 100) : 33;
  }

  getVacationPercent(): number {
    const total = this.getBalanceFor('Sick') + this.getBalanceFor('Casual') + this.getBalanceFor('Vacation');
    return total > 0 ? Math.round((this.getBalanceFor('Vacation') / total) * 100) : 34;
  }

  goToLeaveRequest(): void {
    this.router.navigate(['/leave-requests']);
  }

  openLeaveHistory(): void {
    this.router.navigate(['/leave-history']);
  }

  openCompanyPolicy(): void {
    // Create dummy PDF content and download
    this.downloadDummyPDF('leave_policy.pdf', 'Company Leave Policy');
  }

  downloadReport(): void {
    // Create dummy PDF content and download
    this.downloadDummyPDF('leave_report.pdf', 'Leave Report 2025');
  }

  private downloadDummyPDF(filename: string, title: string): void {
    // Create a simple text content for the dummy PDF
    const content = `${title}\n\nGenerated on: ${new Date().toLocaleDateString()}\n\nThis is a dummy ${title.toLowerCase()} file for demonstration purposes.\n\nLeave Balance Summary:\n- Sick Leave: ${this.getBalanceFor('Sick')} days\n- Casual Leave: ${this.getBalanceFor('Casual')} days\n- Vacation Leave: ${this.getBalanceFor('Vacation')} days\n\nTotal Available: ${this.getBalanceFor('Sick') + this.getBalanceFor('Casual') + this.getBalanceFor('Vacation')} days`;
    
    // Create a blob and download it as a text file (simulating PDF download)
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  refreshBalance(): void {
    // Simulate refreshing the data
    console.log('Refreshing leave balance data...');
    // In a real app, you would call the service to refresh data
  }
}


