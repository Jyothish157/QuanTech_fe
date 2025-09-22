import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-edit-employee-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditEmployeeProfileComponent {
  emp?: Employee;
  form!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private employees: EmployeeService) {
    this.form = this.fb.group({
      Name: ['', Validators.required],
      EmployeeID: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      Department: ['', Validators.required],
      Designation: ['', Validators.required],
      DOB: ['', Validators.required],
      Address: ['', Validators.required]
    });
    const id = this.route.snapshot.paramMap.get('id') || this.employees.getCurrentUser()?.EmployeeID || '';
    this.emp = this.employees.getEmployee(id);
    if (this.emp) {
      this.form.patchValue({
        Name: this.emp.Name,
        EmployeeID: this.emp.EmployeeID,
        Email: this.emp.Email || '',
        Phone: this.emp.Phone || '',
        Department: this.emp.Department,
        Designation: this.emp.Designation || this.emp.Role,
        DOB: this.emp.DOB || '',
        Address: this.emp.Address || ''
      });
    }
  }

  save(): void {
    if (this.form.invalid || !this.emp) { this.form.markAllAsTouched(); return; }
    const updated: Employee = { ...this.emp, ...this.form.getRawValue() } as Employee;
    this.employees.updateEmployee(this.emp.EmployeeID, updated);
    this.router.navigate(['/employee-profile/profile', updated.EmployeeID]);
  }
}


