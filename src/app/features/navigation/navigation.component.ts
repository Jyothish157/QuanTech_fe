import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  isManager = false;

  constructor(private auth: AuthService, private router: Router) {
    this.isManager = this.auth.currentUser()?.role === 'manager';
  }

  logout() {
    const ok = window.confirm('Are you sure you want to logout?');
    if (!ok) return;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
