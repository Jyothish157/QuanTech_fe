import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Attendance } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit, OnDestroy {
  now = signal(new Date());
  private _tick?: number;
  currentEmployee: any;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {
    // Get the currently authenticated user
    const currentUserId = this.authService.getCurrentEmployeeId();
    this.currentEmployee = currentUserId
      ? this.employeeService.getEmployee(currentUserId)
      : null;
  }

  ngOnInit() {
    this._tick = window.setInterval(() => this.now.set(new Date()), 1000);
  }

  ngOnDestroy() {
    if (this._tick) window.clearInterval(this._tick);
  }

  isClockedIn(): boolean {
    return this.currentEmployee
      ? this.attendanceService.isClockedIn(this.currentEmployee.EmployeeID)
      : false;
  }

  getAttendanceRecords(): Attendance[] {
    return this.attendanceService.getAttendance();
  }

  getTodayAttendance(): Attendance | undefined {
    return this.currentEmployee
      ? this.attendanceService.getTodayAttendance(
          this.currentEmployee.EmployeeID
        )
      : undefined;
  }

  toggleClock(): void {
    if (!this.currentEmployee) return;

    if (this.isClockedIn()) {
      this.attendanceService.clockOut(this.currentEmployee.EmployeeID);
    } else {
      this.attendanceService.clockIn(this.currentEmployee.EmployeeID);
    }
  }

  formatTime(timeString: string): string {
    return new Date(timeString).toLocaleTimeString();
  }

  formatDate(timeString: string): string {
    return new Date(timeString).toLocaleDateString();
  }
}
