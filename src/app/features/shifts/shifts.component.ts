import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShiftService } from '../../services/shift.service';
import { AuthService } from '../../services/auth.service';
import { ShiftItem } from '../../models/shift.model';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent {
  private shift = inject(ShiftService);
  private auth = inject(AuthService);

  shifts = computed(() => {
    const currentUser = this.auth.currentUser();
    return currentUser ? this.shift.getEmployeeShifts(currentUser.id) : [];
  });

  swapRequests = this.shift.swapRequests;
  isManager = computed(() => this.auth.currentUser()?.role === 'manager');

  swap = { date: '', from: 'Morning' as const, to: 'Evening' as const };
  newShift: Omit<ShiftItem, 'shiftId'> = {
    employeeId: '',
    date: '',
    time: 'Morning'
  };

  requestSwap() {
    const currentUser = this.auth.currentUser();
    if (!currentUser) return;

    this.shift.requestSwap(this.swap.date, this.swap.from, this.swap.to, currentUser.id);
    alert('Swap request submitted for '+this.swap.date+': '+this.swap.from+' → '+this.swap.to);
    this.swap = { date: '', from: 'Morning', to: 'Evening' };
  }

  createShift() {
    if (!this.isManager()) return;
    
    const shift = this.shift.createShift(this.newShift);
    alert('New shift created');
    this.newShift = {
      employeeId: '',
      date: '',
      time: 'Morning'
    };
  }

  approveSwap(employeeId: string, date: string) {
    if (!this.isManager()) return;
    this.shift.approveSwapRequest(employeeId, date);
  }

  rejectSwap(employeeId: string, date: string) {
    if (!this.isManager()) return;
    this.shift.rejectSwapRequest(employeeId, date);
  }
}


