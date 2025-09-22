import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class EmployeeProfileComponent {
  emp?: Employee;

  constructor(private route: ActivatedRoute, private router: Router, private employees: EmployeeService) {
    const id = this.route.snapshot.paramMap.get('id') || this.employees.getCurrentUser()?.EmployeeID || '';
    this.emp = this.employees.getEmployee(id);
  }

  edit(): void {
    if (!this.emp) return;
    this.router.navigate(['/employee-profile/edit', this.emp.EmployeeID]);
  }
}


