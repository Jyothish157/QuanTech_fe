import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employeesSignal = signal<Employee[]>([
    { id: 'E1001', name: 'John Doe', department: 'Customer Service' },
    { id: 'E1002', name: 'Sarah Wilson', department: 'Sales' }
  ]);

  employees(){ return this.employeesSignal(); }

  addEmployee(emp: Employee){
    this.employeesSignal.update(list => [emp, ...list]);
  }

  search(term: string){
    const t = term.toLowerCase();
    return this.employeesSignal().filter(e =>
      e.id.toLowerCase().includes(t) || e.name.toLowerCase().includes(t) || e.department.toLowerCase().includes(t)
    );
  }
}


