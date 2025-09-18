import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private auth: AuthService, private router: Router) {}
  logout(){
    const ok = window.confirm('Are you sure you want to logout?');
    if(!ok) return;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}


