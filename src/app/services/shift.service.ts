import { Injectable, signal } from '@angular/core';
import { ShiftItem, ShiftSwapRequest } from '../models/shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private _shifts = signal<ShiftItem[]>([]);
  private _swapRequests = signal<ShiftSwapRequest[]>([]);

  shifts = this._shifts.asReadonly();
  swapRequests = this._swapRequests.asReadonly();

  constructor() {
    // Initialize with some mock data
    this._shifts.set([
      this.createShift({
        employeeId: '1',
        date: new Date().toLocaleDateString(),
        time: 'Morning'
      }),
      this.createShift({
        employeeId: '2',
        date: new Date(Date.now()+86400000).toLocaleDateString(),
        time: 'Evening'
      })
    ]);
  }

  createShift(shift: Omit<ShiftItem, 'shiftId'>) {
    const newShift = {
      ...shift,
      shiftId: Math.random().toString(36).substr(2, 9)
    };
    this._shifts.update(shifts => [...shifts, newShift]);
    return newShift;
  }

  assignShift(shiftId: string, employeeId: string) {
    this._shifts.update(shifts =>
      shifts.map(s => s.shiftId === shiftId ? { ...s, employeeId } : s)
    );
  }

  getEmployeeShifts(employeeId: string) {
    return this.shifts().filter(s => s.employeeId === employeeId);
  }

  requestSwap(date: string, from: ShiftItem['time'], to: ShiftItem['time'], employeeId: string) {
    const request: ShiftSwapRequest = {
      date,
      from,
      to,
      employeeId,
      status: 'Pending'
    };
    this._swapRequests.update(requests => [...requests, request]);
    return request;
  }

  approveSwapRequest(employeeId: string, date: string) {
    this._swapRequests.update(requests =>
      requests.map(r => 
        r.employeeId === employeeId && r.date === date
          ? { ...r, status: 'Approved' }
          : r
      )
    );
    
    // Update the actual shift
    this._shifts.update(shifts =>
      shifts.map(s =>
        s.employeeId === employeeId && s.date === date
          ? { ...s, time: this._swapRequests().find(r => 
              r.employeeId === employeeId && r.date === date
            )?.to || s.time }
          : s
      )
    );
  }

  rejectSwapRequest(employeeId: string, date: string) {
    this._swapRequests.update(requests =>
      requests.map(r =>
        r.employeeId === employeeId && r.date === date
          ? { ...r, status: 'Rejected' }
          : r
      )
    );
  }
}


