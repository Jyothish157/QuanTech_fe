import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css'],
})
export class EmployeeAttendanceComponent {
  constructor(private employeesSrv: EmployeeService) {}
  term = '';

  get employees() {
    return this.term
      ? this.employeesSrv.search(this.term)
      : this.employeesSrv.getEmployees();
  }
}
