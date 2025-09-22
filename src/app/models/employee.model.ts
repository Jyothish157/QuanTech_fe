export interface Employee {
  EmployeeID: string;
  Name: string;
  Department: string;
  Email?: string;
  Designation?: string;
  Phone?: string;
  DOB?: string; // ISO date string
  Address?: string;
  Role: 'Employee' | 'Manager';
  Username?: string;
  Password?: string;
}


