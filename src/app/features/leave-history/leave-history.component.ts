import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';

type LeaveHistoryRow = {
  date: string;
  type: 'Sick' | 'Vacation' | 'Casual';
  days: number;
  status: 'Approved' | 'Rejected' | 'Pending';
};

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.css'],
})
export class LeaveHistoryComponent {
  rows: LeaveHistoryRow[] = [
    { date: '2025-01-10', type: 'Sick', days: 1, status: 'Approved' },
    { date: '2025-02-03', type: 'Vacation', days: 3, status: 'Approved' },
    { date: '2025-03-15', type: 'Casual', days: 1, status: 'Rejected' },
    { date: '2025-04-22', type: 'Vacation', days: 2, status: 'Approved' },
  ];

  constructor(private download: DownloadService) {}

  downloadCsv(): void {
    const header = ['Date', 'Type', 'Days', 'Status'];
    const lines = [
      header.join(','),
      ...this.rows.map((r) =>
        [r.date, r.type, String(r.days), r.status].join(',')
      ),
    ];
    this.download.downloadText(
      lines.join('\n'),
      'leave-history.csv',
      'text/csv;charset=utf-8'
    );
  }
}
