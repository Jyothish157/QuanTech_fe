import { Injectable, signal } from '@angular/core';
import { AttendanceRecord } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  isClockedIn = signal(false);
  records = signal<AttendanceRecord[]>([
    { date: new Date().toLocaleDateString(), in: '—' }
  ]);

  clockIn(): void {
    if (this.isClockedIn()) return;
    this.isClockedIn.set(true);
    const rec = { ...this.records()[0], in: new Date().toLocaleTimeString() };
    this.records.set([rec, ...this.records().slice(1)]);
  }

  clockOut(): void {
    if (!this.isClockedIn()) return;
    this.isClockedIn.set(false);
    const now = new Date();
    const rec = { ...this.records()[0], out: now.toLocaleTimeString(), total: '8h 00m' };
    this.records.set([rec, ...this.records().slice(1)]);
  }
}


