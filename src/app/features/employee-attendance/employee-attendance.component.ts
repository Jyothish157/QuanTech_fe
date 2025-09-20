import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent {
  constructor(private employeesSrv: EmployeeService) {}
  form = { id: '', name: '', department: '' };
  term = '';

  get employees(){
    return this.term ? this.employeesSrv.search(this.term) : this.employeesSrv.getEmployees();
  }

  add(){
    if(!this.form.id || !this.form.name) return;
    this.employeesSrv.addEmployee({ 
      EmployeeID: this.form.id, 
      Name: this.form.name, 
      Department: this.form.department || 'General',
      Role: 'Employee'
    });
    this.form = { id: '', name: '', department: '' };
  }
}


