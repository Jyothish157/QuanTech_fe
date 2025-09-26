import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShiftService } from '../../services/shift.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Shift, ShiftSwapRequest } from '../../models/shift.model';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent {
  currentEmployee: any;
  isManager = false;
  message = '';

  swap = { date: '', from: 'Morning' as const, to: 'Evening' as const };
  newShift = {
    employeeId: '',
    date: '',
    shiftType: 'Morning' as const,
  };

  constructor(
    private shiftService: ShiftService,
    private employeeService: EmployeeService,
    private auth: AuthService
  ) {
    // Get the currently authenticated user
    const currentUserId = this.auth.getCurrentEmployeeId();
    this.currentEmployee = currentUserId
      ? this.employeeService.getEmployee(currentUserId)
      : null;
    this.isManager = this.auth.currentUser()?.role === 'manager';
  }

  get shifts(): Shift[] {
    return this.currentEmployee
      ? this.shiftService.getEmployeeShifts(this.currentEmployee.EmployeeID)
      : [];
  }

  get allShifts(): Shift[] {
    return this.shiftService.getShifts();
  }

  get swapRequests(): ShiftSwapRequest[] {
    return this.shiftService.getSwapRequests();
  }

  get pendingSwapRequests(): ShiftSwapRequest[] {
    return this.swapRequests.filter((r) => r.Status === 'Pending');
  }

  requestSwap(): void {
    if (!this.currentEmployee) return;

    this.shiftService.requestShiftSwap(
      this.currentEmployee.EmployeeID,
      this.swap.date,
      this.swap.from,
      this.swap.to
    );

    this.message = `Swap request submitted for ${this.swap.date}: ${this.swap.from} → ${this.swap.to}`;
    this.swap = { date: '', from: 'Morning', to: 'Evening' };

    setTimeout(() => (this.message = ''), 3000);
  }

  createShift(): void {
    if (!this.isManager) return;

    this.shiftService.assignShift(
      this.newShift.employeeId,
      this.newShift.date,
      this.newShift.shiftType
    );

    this.message = 'New shift created successfully!';
    this.newShift = {
      employeeId: '',
      date: '',
      shiftType: 'Morning',
    };

    setTimeout(() => (this.message = ''), 3000);
  }

  approveSwap(swapId: string): void {
    if (!this.isManager) return;
    this.shiftService.approveSwapRequest(swapId);
  }

  rejectSwap(swapId: string): void {
    if (!this.isManager) return;
    this.shiftService.rejectSwapRequest(swapId);
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employeeService.getEmployee(employeeId);
    return employee ? employee.Name : employeeId;
  }
}
