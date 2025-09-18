export type LeaveType = 'Sick' | 'Vacation' | 'Casual';

export interface LeaveRequest {
  created: string;
  type: LeaveType;
  from: string;
  to: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
}

export interface LeaveBalanceItem {
  type: LeaveType;
  balanceDays: number;
}


