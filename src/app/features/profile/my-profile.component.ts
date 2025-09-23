import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee, ChangePasswordRequest } from '../../models/employee.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  employee = signal<Employee | null>(null);
  editableEmployee = signal<Employee | null>(null);
  isEditMode = signal(false);
  showChangePassword = signal(false);
  changePasswordForm: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  loading = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  constructor(
    private auth: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployeeData();
  }

  private loadEmployeeData() {
    const currentEmployeeId = this.auth.getCurrentEmployeeId();
    if (currentEmployeeId) {
      const emp = this.employeeService.getEmployee(currentEmployeeId);
      this.employee.set(emp || null);
      this.editableEmployee.set(emp ? { ...emp } : null);
    }
  }

  toggleEditMode() {
    if (this.isEditMode()) {
      // Cancel edit - revert changes
      this.editableEmployee.set(this.employee() ? { ...this.employee()! } : null);
    } else {
      // Start edit mode
      this.clearMessage();
    }
    this.isEditMode.update(mode => !mode);
  }

  saveProfile() {
    const editedEmployee = this.editableEmployee();
    if (!editedEmployee) return;

    // Basic validation
    if (!editedEmployee.Name.trim()) {
      this.showMessage('Name is required.', 'error');
      return;
    }

    if (editedEmployee.Email && !this.isValidEmail(editedEmployee.Email)) {
      this.showMessage('Please enter a valid email address.', 'error');
      return;
    }

    this.loading.set(true);

    // Simulate API call delay
    setTimeout(() => {
      try {
        this.employeeService.updateEmployee(editedEmployee.EmployeeID, editedEmployee);
        this.employee.set({ ...editedEmployee });
        this.isEditMode.set(false);
        this.loading.set(false);
        this.showMessage('Profile updated successfully!', 'success');
      } catch (error) {
        this.loading.set(false);
        this.showMessage('Failed to update profile. Please try again.', 'error');
      }
    }, 1000);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toggleChangePassword() {
    this.showChangePassword.update(show => !show);
    this.resetPasswordForm();
    this.clearMessage();
  }

  onChangePassword() {
    const form = this.changePasswordForm;
    
    // Validation
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      this.showMessage('All fields are required.', 'error');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      this.showMessage('New password and confirm password do not match.', 'error');
      return;
    }

    if (form.newPassword.length < 6) {
      this.showMessage('New password must be at least 6 characters long.', 'error');
      return;
    }

    const employeeId = this.employee()?.EmployeeID;
    if (!employeeId) {
      this.showMessage('Employee information not found.', 'error');
      return;
    }

    this.loading.set(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = this.employeeService.changePassword(
        employeeId,
        form.currentPassword,
        form.newPassword
      );

      this.loading.set(false);
      
      if (result.success) {
        this.showMessage(result.message, 'success');
        this.resetPasswordForm();
        this.showChangePassword.set(false);
      } else {
        this.showMessage(result.message, 'error');
      }
    }, 1000);
  }

  private resetPasswordForm() {
    this.changePasswordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message.set(msg);
    this.messageType.set(type);
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => this.clearMessage(), 3000);
    }
  }

  private clearMessage() {
    this.message.set('');
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  }

  getManagerName(): string {
    const employee = this.employee();
    if (!employee?.ManagerID) return '-';
    
    const manager = this.employeeService.getEmployee(employee.ManagerID);
    return manager?.Name || '-';
  }

  editProfile() {
    this.toggleEditMode();
  }
}
