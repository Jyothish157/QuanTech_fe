import { Injectable, signal } from '@angular/core';
import { Attendance } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly STORAGE_KEY = 'lams_attendance';
  private attendanceSignal = signal<Attendance[]>([]);

  constructor() {
    this.loadFromStorage();
    this.initializeSampleAttendance();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.attendanceSignal.set(JSON.parse(stored));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.attendanceSignal()));
  }

  getAttendance(): Attendance[] {
    return this.attendanceSignal();
  }

  getTodayAttendance(employeeId: string): Attendance | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.attendanceSignal().find(a => 
      a.EmployeeID === employeeId && 
      a.ClockInTime.startsWith(today)
    );
  }

  clockIn(employeeId: string): void {
    const today = new Date().toISOString().split('T')[0];
    const existing = this.getTodayAttendance(employeeId);
    
    if (existing && !existing.ClockOutTime) {
      return; // Already clocked in today
    }

    const attendance: Attendance = {
      EmployeeID: employeeId,
      ClockInTime: new Date().toISOString(),
      ClockOutTime: undefined,
      WorkHours: undefined
    };

    this.attendanceSignal.update(list => [attendance, ...list]);
    this.saveToStorage();
  }

  clockOut(employeeId: string): void {
    const todayAttendance = this.getTodayAttendance(employeeId);
    if (!todayAttendance || todayAttendance.ClockOutTime) {
      return; // Not clocked in or already clocked out
    }

    const clockOutTime = new Date();
    const clockInTime = new Date(todayAttendance.ClockInTime);
    const workHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    const updatedAttendance: Attendance = {
      ...todayAttendance,
      ClockOutTime: clockOutTime.toISOString(),
      WorkHours: Math.round(workHours * 100) / 100
    };

    this.attendanceSignal.update(list => 
      list.map(a => a === todayAttendance ? updatedAttendance : a)
    );
    this.saveToStorage();
  }

  isClockedIn(employeeId: string): boolean {
    const todayAttendance = this.getTodayAttendance(employeeId);
    return todayAttendance ? !todayAttendance.ClockOutTime : false;
  }

  private initializeSampleAttendance(): void {
    // Clear existing data to ensure fresh sample data
    localStorage.removeItem(this.STORAGE_KEY);
    if (this.attendanceSignal().length === 0) {
      const sampleAttendance: Attendance[] = [];
      const employeeIds = ['E1001', 'E1002', 'E1003', 'E1004', 'E1005', 'E1006', 'E1007', 'E1008', 'E1009', 'E1010'];
      
      // Generate attendance for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Randomly select 70-90% of employees for each day
        const numEmployees = Math.floor(Math.random() * 4) + 7; // 7-10 employees per day
        const shuffledEmployees = [...employeeIds].sort(() => 0.5 - Math.random());
        const selectedEmployees = shuffledEmployees.slice(0, numEmployees);
        
        selectedEmployees.forEach(employeeId => {
          const clockInTime = new Date(date);
          clockInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);
          
          const clockOutTime = new Date(clockInTime);
          clockOutTime.setHours(16 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);
          
          const workHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
          
          sampleAttendance.push({
            EmployeeID: employeeId,
            ClockInTime: clockInTime.toISOString(),
            ClockOutTime: clockOutTime.toISOString(),
            WorkHours: Math.round(workHours * 100) / 100
          });
        });
      }
      
      this.attendanceSignal.set(sampleAttendance);
      this.saveToStorage();
    }
  }
}


