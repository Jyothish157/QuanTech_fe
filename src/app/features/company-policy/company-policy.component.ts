import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';

@Component({
  selector: 'app-company-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-policy.component.html',
  styleUrls: ['./company-policy.component.css'],
})
export class CompanyPolicyComponent {
  constructor(private download: DownloadService) {}

  downloadPdf(): void {
    const content = `Company Leave Policy\n\n- Sick Leave: 12 days/year\n- Vacation Leave: 15 days/year\n- Casual Leave: 8 days/year\n\nHolidays 2025:\n- Jan 26 Republic Day\n- Aug 15 Independence Day\n- Oct 2 Gandhi Jayanti\n\nAttendance Bonus:\n- Perfect monthly attendance: ₹1500 bonus`;
    this.download.downloadText(
      content,
      'company-policy.pdf',
      'application/pdf'
    );
  }
}
