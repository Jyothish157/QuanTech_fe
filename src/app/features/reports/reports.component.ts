import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { LeaveService } from '../../services/leave.service';
import { ShiftService } from '../../services/shift.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Attendance } from '../../models/attendance.model';
import { LeaveRequest } from '../../models/leave.model';
import { Shift } from '../../models/shift.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  currentEmployee: any;
  isManager = false;

  constructor(
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private shiftService: ShiftService,
    private employeeService: EmployeeService,
    private auth: AuthService
  ) {
    this.currentEmployee = this.employeeService.getCurrentUser();
    this.isManager = this.auth.currentUser()?.role === 'manager';
  }

  get attendanceData(): Attendance[] {
    return this.attendanceService.getAttendance();
  }

  get leaveData(): LeaveRequest[] {
    return this.leaveService.getLeaveRequests();
  }

  get shiftData(): Shift[] {
    return this.shiftService.getShifts();
  }

  get attendanceTrend(): number[] {
    // Generate attendance trend for last 7 days
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAttendance = this.attendanceData.filter(a => 
        a.ClockInTime.startsWith(dateStr)
      );
      
      const totalEmployees = this.employeeService.getEmployees().length;
      const presentEmployees = dayAttendance.length;
      const percentage = totalEmployees > 0 ? (presentEmployees / totalEmployees) * 100 : 0;
      trend.push(Math.round(percentage));
    }
    return trend;
  }

  get leaveUsageByType(): { type: string; count: number; percentage: number }[] {
    const leaveTypes = ['Sick', 'Vacation', 'Casual'];
    const totalLeaves = this.leaveData.filter(l => l.Status === 'Approved').length;
    
    return leaveTypes.map(type => {
      const count = this.leaveData.filter(l => 
        l.LeaveType === type && l.Status === 'Approved'
      ).length;
      const percentage = totalLeaves > 0 ? (count / totalLeaves) * 100 : 0;
      return { type, count, percentage: Math.round(percentage) };
    });
  }

  get totalWorkHours(): number {
    return this.attendanceData
      .filter(a => a.WorkHours)
      .reduce((total, a) => total + (a.WorkHours || 0), 0);
  }

  get averageWorkHours(): number {
    const completedDays = this.attendanceData.filter(a => a.WorkHours).length;
    return completedDays > 0 ? Math.round((this.totalWorkHours / completedDays) * 100) / 100 : 0;
  }

  get pendingLeaveRequests(): number {
    return this.leaveData.filter(l => l.Status === 'Pending').length;
  }

  get approvedLeaveRequests(): number {
    return this.leaveData.filter(l => l.Status === 'Approved').length;
  }

  get shiftCoverage(): { shift: string; coverage: number }[] {
    const shifts = ['Morning', 'Evening', 'Night'];
    const totalDays = 7; // Last 7 days
    
    return shifts.map(shift => {
      const shiftCount = this.shiftData.filter(s => s.ShiftType === shift).length;
      const coverage = (shiftCount / (totalDays * this.employeeService.getEmployees().length)) * 100;
      return { shift, coverage: Math.round(coverage) };
    });
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employeeService.getEmployee(employeeId);
    return employee ? employee.Name : employeeId;
  }

  getTotalDaysWorked(): number {
    return this.attendanceData.filter(a => a.WorkHours).length;
  }

  getEmployees(): any[] {
    return this.employeeService.getEmployees();
  }

  getEmployeeAttendanceDays(employeeId: string): number {
    return this.attendanceData.filter(a => a.EmployeeID === employeeId).length;
  }

  getEmployeeTotalHours(employeeId: string): number {
    return this.attendanceData
      .filter(a => a.EmployeeID === employeeId && a.WorkHours)
      .reduce((total, a) => total + (a.WorkHours || 0), 0);
  }

  getEmployeeAverageHours(employeeId: string): number {
    const workedDays = this.attendanceData.filter(a => a.EmployeeID === employeeId && a.WorkHours);
    if (workedDays.length === 0) return 0;
    
    const totalHours = workedDays.reduce((total, a) => total + (a.WorkHours || 0), 0);
    return Math.round((totalHours / workedDays.length) * 100) / 100;
  }
}


