export interface Employee {
  EmployeeID: string;
  Name: string;
  Department: string;
  Email?: string;
  Role: 'Employee' | 'Manager';
  Username?: string;
  Password?: string;
}


