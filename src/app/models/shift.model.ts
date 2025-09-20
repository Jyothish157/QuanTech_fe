export interface Shift {
  ShiftID: string;
  EmployeeID: string;
  Date: string;
  ShiftType: 'Morning' | 'Evening' | 'Night';
  StartTime: string;
  EndTime: string;
}

export interface ShiftSwapRequest {
  SwapID: string;
  EmployeeID: string;
  Date: string;
  FromShift: 'Morning' | 'Evening' | 'Night';
  ToShift: 'Morning' | 'Evening' | 'Night';
  Status: 'Pending' | 'Approved' | 'Rejected';
  RequestedBy: string;
}


