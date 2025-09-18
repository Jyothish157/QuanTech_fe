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
    return this.term ? this.employeesSrv.search(this.term) : this.employeesSrv.employees();
  }

  add(){
    if(!this.form.id || !this.form.name) return;
    this.employeesSrv.addEmployee({ id: this.form.id, name: this.form.name, department: this.form.department || 'General' });
    this.form = { id: '', name: '', department: '' };
  }
}


