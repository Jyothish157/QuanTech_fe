import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class EmployeeHomeComponent {
  constructor(private employees: EmployeeService, private router: Router) {}

  get list(): Employee[] { return this.employees.getEmployees(); }

  viewProfile(id: string): void {
    this.router.navigate(['/employee-profile/profile', id]);
  }

  editProfile(id: string): void {
    this.router.navigate(['/employee-profile/edit', id]);
  }
}


