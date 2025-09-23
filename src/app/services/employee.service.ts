import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly STORAGE_KEY = 'lams_employees';
  private employeesSignal = signal<Employee[]>([]);

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultEmployees();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.employeesSignal.set(JSON.parse(stored));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.employeesSignal()));
  }

  private initializeDefaultEmployees(): void {
    // Clear existing data to ensure fresh sample data
    localStorage.removeItem(this.STORAGE_KEY);
    if (this.employeesSignal().length === 0) {
      const defaultEmployees: Employee[] = [
        { 
          EmployeeID: 'E1001', 
          Name: 'Dharani', 
          Department: 'Project Management', 
          Role: 'Employee',
          Email: 'dharani@company.com',
          Phone: '+1-555-0101',
          DOB: '1990-05-15',
          Address: '123 Main St, Anytown, AT 12345',
          Designation: 'Project Manager',
          Username: 'emp',
          Password: 'emp123',
          JoiningDate: '2022-01-15',
          ManagerID: 'E1002'
        },
        { 
          EmployeeID: 'E1002', 
          Name: 'Jyothish', 
          Department: 'Sales', 
          Role: 'Manager',
          Email: 'jyothish@company.com',
          Phone: '+1-555-0102',
          DOB: '1985-08-22',
          Address: '456 Oak Ave, Anytown, AT 12345',
          Designation: 'Sales Manager',
          Username: 'mgnr',
          Password: 'mgnr123',
          JoiningDate: '2020-03-10'
        },
        { 
          EmployeeID: 'E1003', 
          Name: 'Vishwa Vajendra', 
          Department: 'IT', 
          Role: 'Employee',
          Email: 'vishwa.vajendra@company.com',
          Phone: '+1-555-0103',
          DOB: '1992-12-08',
          Address: '789 Pine St, Anytown, AT 12345',
          Designation: 'Software Developer',
          Username: 'vishwa.vajendra',
          Password: 'vishwa123',
          JoiningDate: '2021-06-20',
          ManagerID: 'E1009'
        },
        { 
          EmployeeID: 'E1004', 
          Name: 'Lokeshvaran', 
          Department: 'Marketing', 
          Role: 'Employee',
          Email: 'lokeshvaran@company.com',
          Phone: '+1-555-0104',
          DOB: '1993-03-18',
          Address: '321 Elm St, Anytown, AT 12345',
          Designation: 'Marketing Specialist',
          Username: 'lokeshvaran',
          Password: 'lokesh123',
          JoiningDate: '2022-09-05',
          ManagerID: 'E1005'
        },
        { 
          EmployeeID: 'E1005', 
          Name: 'Vishwa', 
          Department: 'Finance', 
          Role: 'Manager',
          Email: 'vishwa@company.com',
          Phone: '+1-555-0105',
          DOB: '1982-11-30',
          Address: '654 Maple Ave, Anytown, AT 12345',
          Designation: 'Finance Manager',
          Username: 'vishwa',
          Password: 'vishwa123',
          JoiningDate: '2019-01-15'
        },
        { EmployeeID: 'E1006', Name: 'Dhanush', Department: 'HR', Role: 'Employee' },
        { EmployeeID: 'E1007', Name: 'Abinaya', Department: 'Operations', Role: 'Employee' },
        { EmployeeID: 'E1008', Name: 'Rahul', Department: 'IT', Role: 'Employee' },
        { EmployeeID: 'E1009', Name: 'Pranav', Department: 'Marketing', Role: 'Employee' },
        { EmployeeID: 'E1010', Name: 'Nithya', Department: 'Finance', Role: 'Employee' },
        { EmployeeID: 'E1011', Name: 'Sangavi', Department: 'HR', Role: 'Employee' },
        { EmployeeID: 'E1012', Name: 'Aswinya', Department: 'Operations', Role: 'Employee' },
        { EmployeeID: 'E1013', Name: 'Dharun', Department: 'IT', Role: 'Employee' },
        { EmployeeID: 'E1014', Name: 'Punith', Department: 'Sales', Role: 'Employee' },
        { EmployeeID: 'E1015', Name: 'Madesh', Department: 'Marketing', Role: 'Employee' }
      ];
      this.employeesSignal.set(defaultEmployees);
      this.saveToStorage();
    }
  }

  getEmployees(): Employee[] {
    return this.employeesSignal();
  }

  getEmployee(employeeId: string): Employee | undefined {
    return this.employeesSignal().find(e => e.EmployeeID === employeeId);
  }

  addEmployee(emp: Employee): void {
    this.employeesSignal.update(list => [emp, ...list]);
    this.saveToStorage();
  }

  updateEmployee(employeeId: string, updatedEmployee: Employee): void {
    this.employeesSignal.update(list => 
      list.map(emp => emp.EmployeeID === employeeId ? updatedEmployee : emp)
    );
    this.saveToStorage();
  }

  deleteEmployee(employeeId: string): void {
    this.employeesSignal.update(list => 
      list.filter(emp => emp.EmployeeID !== employeeId)
    );
    this.saveToStorage();
  }

  search(term: string): Employee[] {
    const t = term.toLowerCase();
    return this.employeesSignal().filter(e =>
      e.EmployeeID.toLowerCase().includes(t) || 
      e.Name.toLowerCase().includes(t) || 
      e.Department.toLowerCase().includes(t)
    );
  }

  getCurrentUser(): Employee | undefined {
    // In a real app, this would come from authentication
    // For now, return the default employee for demonstration
    return this.getEmployee('E1001');
  }

  changePassword(employeeId: string, currentPassword: string, newPassword: string): { success: boolean; message: string } {
    const employee = this.getEmployee(employeeId);
    
    if (!employee) {
      return { success: false, message: 'Employee not found.' };
    }

    if (!employee.Password || employee.Password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    if (currentPassword === newPassword) {
      return { success: false, message: 'New password must be different from current password.' };
    }

    const updatedEmployee = { ...employee, Password: newPassword };
    this.updateEmployee(employeeId, updatedEmployee);
    
    return { success: true, message: 'Password changed successfully.' };
  }

  getEmployeeByCredentials(username: string, password: string): Employee | null {
    const employee = this.employeesSignal().find(emp => 
      emp.Username === username && emp.Password === password
    );
    return employee || null;
  }
}


