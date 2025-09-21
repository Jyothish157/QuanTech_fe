import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavigationComponent } from './features/navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';

  constructor(private auth: AuthService, private router: Router) {}

  isAuthenticated() { 
    return this.auth.isAuthenticated(); 
  }
}
