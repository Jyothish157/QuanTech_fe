import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  showAddForm = false;
  editingEmployee: Employee | null = null;
  
  newEmployee: Partial<Employee> = {
    EmployeeID: '',
    Name: '',
    Department: '',
    Email: '',
    Role: 'Employee'
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employees = this.employeeService.getEmployees();
    this.filteredEmployees = [...this.employees];
  }

  addNewEmployee() {
    this.resetForm();
    this.newEmployee.EmployeeID = this.generateEmployeeId();
    this.showAddForm = true;
  }

  searchEmployees() {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.employees];
    } else {
      this.filteredEmployees = this.employeeService.search(this.searchTerm);
    }
  }

  addEmployee() {
    if (this.validateEmployee()) {
      const employee: Employee = {
        EmployeeID: this.newEmployee.EmployeeID || this.generateEmployeeId(),
        Name: this.newEmployee.Name!,
        Department: this.newEmployee.Department!,
        Email: this.newEmployee.Email,
        Role: this.newEmployee.Role!,
        Username: this.newEmployee.Username || this.generateUsername(),
        Password: this.newEmployee.Password || this.generatePassword()
      };
      
      this.employeeService.addEmployee(employee);
      this.loadEmployees();
      this.resetForm();
    }
  }

  editEmployee(employee: Employee) {
    this.editingEmployee = { ...employee };
    this.newEmployee = { ...employee };
    this.showAddForm = true;
  }

  updateEmployee() {
    if (this.editingEmployee && this.validateEmployee()) {
      const updatedEmployee: Employee = {
        EmployeeID: this.editingEmployee.EmployeeID,
        Name: this.newEmployee.Name!,
        Department: this.newEmployee.Department!,
        Email: this.newEmployee.Email,
        Role: this.newEmployee.Role!,
        Username: this.newEmployee.Username,
        Password: this.newEmployee.Password
      };
      
      this.employeeService.updateEmployee(this.editingEmployee.EmployeeID, updatedEmployee);
      this.loadEmployees();
      this.resetForm();
    }
  }

  deleteEmployee(employeeId: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(employeeId);
      this.loadEmployees();
    }
  }

  resetForm() {
    this.newEmployee = {
      EmployeeID: '',
      Name: '',
      Department: '',
      Email: '',
      Role: 'Employee'
    };
    this.editingEmployee = null;
    this.showAddForm = false;
  }

  private validateEmployee(): boolean {
    return !!(this.newEmployee.Name && this.newEmployee.Department);
  }

  generateEmployeeId(): string {
    const lastId = this.employees.length > 0 ? 
      Math.max(...this.employees.map(e => parseInt(e.EmployeeID.substring(1)))) : 1000;
    return `E${lastId + 1}`;
  }

  generateUsername(): string {
    const name = this.newEmployee.Name?.toLowerCase().replace(/\s+/g, '') || 'user';
    const randomNum = Math.floor(Math.random() * 1000);
    return `${name}${randomNum}`;
  }

  generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
