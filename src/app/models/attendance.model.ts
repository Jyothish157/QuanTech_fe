export interface Attendance {
  EmployeeID: string;
  ClockInTime: string;
  ClockOutTime?: string;
  WorkHours?: number;
}
