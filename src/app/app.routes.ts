import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { managerGuard } from './guards/manager.guard';
import { employeeGuard } from './guards/employee.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'attendance',
    loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent),
    canActivate: [authGuard]
  },
  {
    path: 'leave-requests',
    loadComponent: () => import('./features/leave-requests/leave-requests.component').then(m => m.LeaveRequestsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'leave-balance',
    loadComponent: () => import('./features/leave-balance/leave-balance.component').then(m => m.LeaveBalanceComponent),
    canActivate: [authGuard]
  },
  {
    path: 'leave-history',
    loadComponent: () => import('./features/leave-history/leave-history.component').then(m => m.LeaveHistoryComponent),
    canActivate: [authGuard]
  },
  {
    path: 'company-policy',
    loadComponent: () => import('./features/company-policy/company-policy.component').then(m => m.CompanyPolicyComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-profile',
    loadComponent: () => import('./features/profile/my-profile.component').then(m => m.MyProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'shifts',
    loadComponent: () => import('./features/shifts/shifts.component').then(m => m.ShiftsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employee-attendance',
    loadComponent: () => import('./features/employee-attendance/employee-attendance.component').then(m => m.EmployeeAttendanceComponent),
    canActivate: [authGuard, managerGuard]
  },
  {
    path: 'employee-management',
    loadComponent: () => import('./features/employee-management/employee-management.component').then(m => m.EmployeeManagementComponent),
    canActivate: [authGuard, managerGuard]
  },
  {
    path: 'employee-profile',
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/employee-profile/home.component').then(m => m.EmployeeHomeComponent), canActivate: [authGuard] },
      { path: 'profile/:id', loadComponent: () => import('./features/employee-profile/profile.component').then(m => m.EmployeeProfileComponent), canActivate: [authGuard] },
      { path: 'edit/:id', loadComponent: () => import('./features/employee-profile/edit-profile.component').then(m => m.EditEmployeeProfileComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
