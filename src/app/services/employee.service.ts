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
        { EmployeeID: 'E1001', Name: 'John Doe', Department: 'Customer Service', Role: 'Employee' },
        { EmployeeID: 'E1002', Name: 'Sarah Wilson', Department: 'Sales', Role: 'Manager' },
        { EmployeeID: 'E1003', Name: 'Mike Johnson', Department: 'IT', Role: 'Employee' },
        { EmployeeID: 'E1004', Name: 'Emily Davis', Department: 'Marketing', Role: 'Employee' },
        { EmployeeID: 'E1005', Name: 'David Brown', Department: 'Finance', Role: 'Manager' },
        { EmployeeID: 'E1006', Name: 'Lisa Garcia', Department: 'HR', Role: 'Employee' },
        { EmployeeID: 'E1007', Name: 'Robert Miller', Department: 'Operations', Role: 'Employee' },
        { EmployeeID: 'E1008', Name: 'Jennifer Taylor', Department: 'Customer Service', Role: 'Employee' },
        { EmployeeID: 'E1009', Name: 'Michael Anderson', Department: 'IT', Role: 'Manager' },
        { EmployeeID: 'E1010', Name: 'Amanda White', Department: 'Sales', Role: 'Employee' },
        { EmployeeID: 'E1011', Name: 'Christopher Lee', Department: 'Marketing', Role: 'Employee' },
        { EmployeeID: 'E1012', Name: 'Jessica Martinez', Department: 'Finance', Role: 'Employee' },
        { EmployeeID: 'E1013', Name: 'Daniel Thompson', Department: 'HR', Role: 'Manager' },
        { EmployeeID: 'E1014', Name: 'Ashley Jackson', Department: 'Operations', Role: 'Employee' },
        { EmployeeID: 'E1015', Name: 'Matthew Harris', Department: 'Customer Service', Role: 'Employee' }
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
    return this.getEmployee('E1001');
  }
}


