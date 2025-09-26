import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { LeaveType, LeaveRequest } from '../../models/leave.model';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css'],
})
export class LeaveRequestsComponent {
  types: LeaveType[] = ['Sick', 'Vacation', 'Casual'];
  form = { type: 'Sick' as LeaveType, from: '', to: '', reason: '' };
  currentEmployee: any;
  isManager = false;
  message = '';

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private auth: AuthService
  ) {
    this.currentEmployee = this.employeeService.getCurrentUser();
    this.isManager = this.auth.currentUser()?.role === 'manager';
  }

  get requests(): LeaveRequest[] {
    return this.leaveService.getLeaveRequests();
  }

  get myRequests(): LeaveRequest[] {
    return this.currentEmployee
      ? this.requests.filter(
          (r) => r.EmployeeID === this.currentEmployee!.EmployeeID
        )
      : [];
  }

  get pendingRequests(): LeaveRequest[] {
    return this.requests.filter((r) => r.Status === 'Pending');
  }

  submit(): void {
    if (!this.currentEmployee) return;

    const success = this.leaveService.submitRequest(
      this.currentEmployee.EmployeeID,
      this.form.type,
      this.form.from,
      this.form.to,
      this.form.reason
    );

    if (success) {
      this.message = 'Leave request submitted successfully!';
      this.form = { type: 'Sick', from: '', to: '', reason: '' };
    } else {
      this.message = 'Insufficient leave balance for this request.';
    }

    setTimeout(() => (this.message = ''), 3000);
  }

  approveRequest(leaveId: string): void {
    this.leaveService.approveRequest(leaveId);
  }

  rejectRequest(leaveId: string): void {
    this.leaveService.rejectRequest(leaveId);
  }

  calcDays(from: string, to: string): number {
    if (!from || !to) return 0;
    const a = new Date(from).getTime();
    const b = new Date(to).getTime();
    const days = Math.round((b - a) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(days, 1);
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employeeService.getEmployee(employeeId);
    return employee ? employee.Name : employeeId;
  }
}
