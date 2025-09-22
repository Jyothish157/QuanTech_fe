import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  isManager = false;
  sidebarOpen = false;
  myEmployeeId = '';

  constructor(private auth: AuthService, private router: Router, private employees: EmployeeService) {
    this.isManager = this.auth.currentUser()?.role === 'manager';
    this.myEmployeeId = this.employees.getCurrentUser()?.EmployeeID || '';
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  logout() {
    const ok = window.confirm('Are you sure you want to logout?');
    if (!ok) return;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToMyProfile(): void {
    const id = this.myEmployeeId || this.employees.getCurrentUser()?.EmployeeID || 'E1001';
    this.router.navigate(['/employee-profile/profile', id]);
  }
}
