import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="nf">
      <h2>404</h2>
      <p>Page not found.</p>
      <a routerLink="/dashboard" class="btn">Go to Dashboard</a>
    </section>
  `,
  styles: [
    `
      .nf {
        display: grid;
        place-items: center;
        gap: 0.5rem;
        min-height: 50dvh;
      }
      .btn {
        padding: 0.6rem 1rem;
        background: #22c55e;
        color: #fff;
        border-radius: 8px;
        text-decoration: none;
      }
    `,
  ],
})
export class NotFoundComponent {}
