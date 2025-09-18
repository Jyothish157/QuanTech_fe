import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {
  constructor(private attendance: AttendanceService) {}
  isClockedIn(){ return this.attendance.isClockedIn(); }
  records(){ return this.attendance.records(); }
  now = signal(new Date());
  private _tick?: number;

  ngOnInit(){
    this._tick = window.setInterval(() => this.now.set(new Date()), 1000);
  }
  ngOnDestroy(){ if(this._tick) window.clearInterval(this._tick); }

  toggleClock(){
    if(this.isClockedIn()){
      this.attendance.clockOut();
    } else {
      this.attendance.clockIn();
    }
  }
}


