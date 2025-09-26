import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';
import { LeaveService } from '../../services/leave.service';
import { ShiftService } from '../../services/shift.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  currentEmployee: any;
  isManager = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private shiftService: ShiftService,
    private employeeService: EmployeeService
  ) {
    const currentEmployeeId = this.auth.getCurrentEmployeeId() || 'E1001';
    this.currentEmployee = this.employeeService.getEmployee(currentEmployeeId);
    this.isManager = this.auth.currentUser()?.role === 'manager';
  }

  logout() {
    const ok = window.confirm('Are you sure you want to logout?');
    if (!ok) return;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get todayAttendancePercentage(): number {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.attendanceService
      .getAttendance()
      .filter((a) => a.ClockInTime.startsWith(today));
    const totalEmployees = this.employeeService.getEmployees().length;
    return totalEmployees > 0
      ? Math.round((todayAttendance.length / totalEmployees) * 100)
      : 0;
  }

  get pendingLeaveRequests(): number {
    const allPendingRequests = this.leaveService
      .getLeaveRequests()
      .filter((l) => l.Status === 'Pending');

    if (this.isManager) {
      // Managers see all pending requests
      return allPendingRequests.length;
    } else {
      // Employees see only their own pending requests
      const currentEmployeeId = this.currentEmployee?.EmployeeID;
      return currentEmployeeId 
        ? allPendingRequests.filter(l => l.EmployeeID === currentEmployeeId).length
        : 0;
    }
  }

  get shiftCoveragePercentage(): number {
    const totalShifts = this.shiftService.getShifts().length;
    const totalEmployees = this.employeeService.getEmployees().length;
    const expectedShifts = totalEmployees * 7; // 7 days
    return expectedShifts > 0
      ? Math.round((totalShifts / expectedShifts) * 100)
      : 0;
  }

  get isClockedIn(): boolean {
    return this.currentEmployee
      ? this.attendanceService.isClockedIn(this.currentEmployee.EmployeeID)
      : false;
  }

  get recentActivity(): string[] {
    const activities = [];
    const currentEmployeeId = this.currentEmployee?.EmployeeID;

    if (this.isManager) {
      // Managers see all employees' activities
      // Check for recent approved leave requests
      const recentApprovedLeaves = this.leaveService
        .getLeaveRequests()
        .filter((l) => l.Status === 'Approved')
        .slice(0, 2);

      recentApprovedLeaves.forEach((leave) => {
        const employee = this.employeeService.getEmployee(leave.EmployeeID);
        if (employee) {
          activities.push(
            `${employee.Name}'s ${leave.LeaveType} leave request was approved`
          );
        }
      });

      // Check for recent pending leave requests
      const recentPendingLeaves = this.leaveService
        .getLeaveRequests()
        .filter((l) => l.Status === 'Pending')
        .slice(0, 1);

      recentPendingLeaves.forEach((leave) => {
        const employee = this.employeeService.getEmployee(leave.EmployeeID);
        if (employee) {
          activities.push(
            `${employee.Name} submitted a ${leave.LeaveType} leave request`
          );
        }
      });

      // Check for recent shift swaps
      const recentSwaps = this.shiftService
        .getSwapRequests()
        .filter((s) => s.Status === 'Approved')
        .slice(0, 1);

      recentSwaps.forEach((swap) => {
        const employee = this.employeeService.getEmployee(swap.EmployeeID);
        if (employee) {
          activities.push(`Shift swap approved for ${employee.Name}`);
        }
      });
    } else {
      // Employees see only their own activities
      if (currentEmployeeId) {
        // Check for current employee's recent leave requests
        const myLeaveRequests = this.leaveService
          .getLeaveRequests()
          .filter((l) => l.EmployeeID === currentEmployeeId)
          .slice(0, 2);

        myLeaveRequests.forEach((leave) => {
          const statusText = leave.Status === 'Pending' 
            ? 'submitted' 
            : leave.Status === 'Approved' 
            ? 'approved' 
            : 'rejected';
          activities.push(
            `Your ${leave.LeaveType} leave request was ${statusText}`
          );
        });

        // Check for current employee's shift swap requests
        const myShiftSwaps = this.shiftService
          .getSwapRequests()
          .filter((s) => s.EmployeeID === currentEmployeeId)
          .slice(0, 1);

        myShiftSwaps.forEach((swap) => {
          const statusText = swap.Status === 'Pending'
            ? 'is pending approval'
            : swap.Status === 'Approved'
            ? 'was approved'
            : 'was rejected';
          activities.push(`Your shift swap request ${statusText}`);
        });

        // Check if clocked in today
        if (this.isClockedIn) {
          activities.push('You are currently clocked in');
        }
      }
    }

    // Add attendance sync activity as fallback if no other activities
    if (activities.length === 0) {
      activities.push('Attendance synced at ' + new Date().toLocaleTimeString());
    }

    return activities.slice(0, 3);
  }

  getTodayAttendanceCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.attendanceService
      .getAttendance()
      .filter((a) => a.ClockInTime.startsWith(today)).length;
  }

  getTotalEmployees(): number {
    return this.employeeService.getEmployees().length;
  }

  getShiftCount(): number {
    return this.shiftService.getShifts().length;
  }
}
