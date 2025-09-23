import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private employees: EmployeeService,
    private auth: AuthService
  ) {
    const id = this.route.snapshot.paramMap.get('id') || this.auth.getCurrentEmployeeId() || 'E1001';
    this.emp = this.employees.getEmployee(id);
  }

  edit(): void {
    if (!this.emp) return;
    this.router.navigate(['/employee-profile/edit', this.emp.EmployeeID]);
  }
}


