import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { AttendanceService } from '../../services/attendance.service';
import { LeaveService } from '../../services/leave.service';
import { Employee, EmployeeProfile } from '../../models/employee.model';
import { AttendanceSummary } from '../../models/attendance.model';
import { LeaveSummary } from '../../models/leave.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentUser: any = null;
  employee: Employee | null = null;
  employeeProfile: EmployeeProfile | null = null;
  isLoading = false;
  isEditing = false;
  
  // Forms
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  // Data
  attendanceSummary: AttendanceSummary | null = null;
  leaveSummary: LeaveSummary | null = null;
  
  // UI state
  selectedTabIndex = 0;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: [''],
      position: [''],
      hireDate: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadEmployeeProfile();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEmployeeProfile(): void {
    if (!this.currentUser) return;

    this.isLoading = true;

    // Load employee details
    this.employeeService.getEmployeeById(this.currentUser.id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.populateProfileForm(employee);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee profile:', error);
        this.isLoading = false;
      }
    });

    // Load employee profile with additional data
    this.employeeService.getEmployeeProfile(this.currentUser.id).subscribe({
      next: (profile) => {
        this.employeeProfile = profile;
      },
      error: (error) => {
        console.error('Error loading employee profile data:', error);
      }
    });

    // Load attendance summary
    const startDate = new Date();
    startDate.setDate(1);
    const endDate = new Date();

    this.attendanceService.getAttendanceSummary(this.currentUser.id, startDate, endDate).subscribe({
      next: (summary) => {
        this.attendanceSummary = summary;
      },
      error: (error) => {
        console.error('Error loading attendance summary:', error);
      }
    });

    // Load leave summary
    this.leaveService.getLeaveSummary(this.currentUser.id).subscribe({
      next: (summary) => {
        this.leaveSummary = summary;
      },
      error: (error) => {
        console.error('Error loading leave summary:', error);
      }
    });
  }

  private populateProfileForm(employee: Employee): void {
    this.profileForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  editProfile(): void {
    this.isEditing = true;
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.employee) {
      const formValue = this.profileForm.value;
      const updateData: Partial<Employee> = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone
      };

      this.employeeService.updateEmployee(this.employee.id, updateData).subscribe({
        next: (employee) => {
          this.employee = employee;
          this.isEditing = false;
          // Update current user in auth service
          this.authService.updateCurrentUser(employee);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.employee) {
      this.populateProfileForm(this.employee);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const formValue = this.passwordForm.value;
      // Implement password change logic
      console.log('Changing password...', formValue);
      this.passwordForm.reset();
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'warn';
      case 'HR':
        return 'accent';
      case 'MANAGER':
        return 'primary';
      case 'EMPLOYEE':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'admin_panel_settings';
      case 'HR':
        return 'people';
      case 'MANAGER':
        return 'supervisor_account';
      case 'EMPLOYEE':
        return 'person';
      default:
        return 'person';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getEmployeeName(): string {
    if (!this.employee) return '';
    return `${this.employee.firstName} ${this.employee.lastName}`;
  }

  getTotalLeaveBalance(): number {
    if (!this.leaveSummary?.leaveBalances) return 0;
    return this.leaveSummary.leaveBalances.reduce((total, balance) => total + balance.remainingDays, 0);
  }

  getAttendancePercentage(): number {
    if (!this.attendanceSummary) return 0;
    return Math.round((this.attendanceSummary.presentDays / this.attendanceSummary.totalDays) * 100);
  }

  getAverageWorkHours(): number {
    if (!this.attendanceSummary) return 0;
    return Math.round((this.attendanceSummary.totalWorkHours / this.attendanceSummary.totalDays) * 10) / 10;
  }

  getInitials(): string {
    if (!this.employee) return '';
    return `${this.employee.firstName.charAt(0)}${this.employee.lastName.charAt(0)}`.toUpperCase();
  }

  getPasswordErrorMessage(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least 8 characters long`;
    }
    if (field?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
