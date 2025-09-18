export interface ShiftItem {
  shiftId: string;
  employeeId: string;
  date: string;
  time: 'Morning' | 'Evening' | 'Night';
}

export interface ShiftSwapRequest {
  date: string;
  from: 'Morning' | 'Evening' | 'Night';
  to: 'Morning' | 'Evening' | 'Night';
  employeeId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}


