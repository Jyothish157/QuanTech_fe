export type LeaveType = 'Sick' | 'Vacation' | 'Casual';

export interface LeaveRequest {
  LeaveID: string;
  EmployeeID: string;
  LeaveType: LeaveType;
  StartDate: string;
  EndDate: string;
  Status: 'Approved' | 'Rejected' | 'Pending';
  Reason?: string;
}

export interface LeaveBalance {
  EmployeeID: string;
  LeaveType: LeaveType;
  BalanceDays: number;
}
