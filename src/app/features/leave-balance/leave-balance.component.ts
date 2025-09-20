import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService
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
}


