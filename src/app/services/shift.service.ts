import { Injectable, signal } from '@angular/core';
import { Shift, ShiftSwapRequest } from '../models/shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private readonly SHIFTS_KEY = 'lams_shifts';
  private readonly SWAP_REQUESTS_KEY = 'lams_shift_swaps';
  
  private shiftsSignal = signal<Shift[]>([]);
  private swapRequestsSignal = signal<ShiftSwapRequest[]>([]);

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultShifts();
    this.initializeSampleShifts();
    this.initializeSampleSwapRequests();
  }

  private loadFromStorage(): void {
    const storedShifts = localStorage.getItem(this.SHIFTS_KEY);
    if (storedShifts) {
      this.shiftsSignal.set(JSON.parse(storedShifts));
    }

    const storedSwaps = localStorage.getItem(this.SWAP_REQUESTS_KEY);
    if (storedSwaps) {
      this.swapRequestsSignal.set(JSON.parse(storedSwaps));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.SHIFTS_KEY, JSON.stringify(this.shiftsSignal()));
    localStorage.setItem(this.SWAP_REQUESTS_KEY, JSON.stringify(this.swapRequestsSignal()));
  }

  private initializeDefaultShifts(): void {
    // Clear existing data to ensure fresh sample data
    localStorage.removeItem(this.SHIFTS_KEY);
    localStorage.removeItem(this.SWAP_REQUESTS_KEY);
    if (this.shiftsSignal().length === 0) {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      
      const defaultShifts: Shift[] = [
        {
          ShiftID: 'S001',
          EmployeeID: 'E1001',
          Date: today.toISOString().split('T')[0],
          ShiftType: 'Morning',
          StartTime: '09:00',
          EndTime: '17:00'
        },
        {
          ShiftID: 'S002',
          EmployeeID: 'E1002',
          Date: today.toISOString().split('T')[0],
          ShiftType: 'Evening',
          StartTime: '17:00',
          EndTime: '01:00'
        },
        {
          ShiftID: 'S003',
          EmployeeID: 'E1003',
          Date: tomorrow.toISOString().split('T')[0],
          ShiftType: 'Morning',
          StartTime: '09:00',
          EndTime: '17:00'
        }
      ];
      this.shiftsSignal.set(defaultShifts);
      this.saveToStorage();
    }
  }

  getShifts(): Shift[] {
    return this.shiftsSignal();
  }

  getEmployeeShifts(employeeId: string): Shift[] {
    return this.shiftsSignal().filter(s => s.EmployeeID === employeeId);
  }

  getSwapRequests(): ShiftSwapRequest[] {
    return this.swapRequestsSignal();
  }

  assignShift(employeeId: string, date: string, shiftType: 'Morning' | 'Evening' | 'Night'): void {
    const shift: Shift = {
      ShiftID: this.generateShiftId(),
      EmployeeID: employeeId,
      Date: date,
      ShiftType: shiftType,
      StartTime: this.getStartTime(shiftType),
      EndTime: this.getEndTime(shiftType)
    };

    this.shiftsSignal.update(list => [shift, ...list]);
    this.saveToStorage();
  }

  requestShiftSwap(employeeId: string, date: string, fromShift: 'Morning' | 'Evening' | 'Night', toShift: 'Morning' | 'Evening' | 'Night'): void {
    const swapRequest: ShiftSwapRequest = {
      SwapID: this.generateSwapId(),
      EmployeeID: employeeId,
      Date: date,
      FromShift: fromShift,
      ToShift: toShift,
      Status: 'Pending',
      RequestedBy: employeeId
    };

    this.swapRequestsSignal.update(list => [swapRequest, ...list]);
    this.saveToStorage();
  }

  approveSwapRequest(swapId: string): void {
    const swapRequest = this.swapRequestsSignal().find(s => s.SwapID === swapId);
    if (!swapRequest) return;

    // Update swap request status
    this.swapRequestsSignal.update(list =>
      list.map(s => s.SwapID === swapId ? { ...s, Status: 'Approved' } : s)
    );

    // Update the actual shift
    this.shiftsSignal.update(list =>
      list.map(shift => {
        if (shift.EmployeeID === swapRequest.EmployeeID && shift.Date === swapRequest.Date) {
          return {
            ...shift,
            ShiftType: swapRequest.ToShift,
            StartTime: this.getStartTime(swapRequest.ToShift),
            EndTime: this.getEndTime(swapRequest.ToShift)
          };
        }
        return shift;
      })
    );

    this.saveToStorage();
  }

  rejectSwapRequest(swapId: string): void {
    this.swapRequestsSignal.update(list =>
      list.map(s => s.SwapID === swapId ? { ...s, Status: 'Rejected' } : s)
    );
    this.saveToStorage();
  }

  private getStartTime(shiftType: 'Morning' | 'Evening' | 'Night'): string {
    switch (shiftType) {
      case 'Morning': return '09:00';
      case 'Evening': return '17:00';
      case 'Night': return '01:00';
      default: return '09:00';
    }
  }

  private getEndTime(shiftType: 'Morning' | 'Evening' | 'Night'): string {
    switch (shiftType) {
      case 'Morning': return '17:00';
      case 'Evening': return '01:00';
      case 'Night': return '09:00';
      default: return '17:00';
    }
  }

  private generateShiftId(): string {
    return 'S' + Date.now().toString();
  }

  private initializeSampleShifts(): void {
    if (this.shiftsSignal().length <= 3) { // Only add if we have minimal data
      const sampleShifts: Shift[] = [];
      const employeeIds = ['E1001', 'E1002', 'E1003', 'E1004', 'E1005', 'E1006', 'E1007', 'E1008', 'E1009', 'E1010', 'E1011', 'E1012', 'E1013', 'E1014', 'E1015'];
      const shiftTypes: ('Morning' | 'Evening' | 'Night')[] = ['Morning', 'Evening', 'Night'];
      
      // Generate shifts for the next 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Assign 3-5 employees per shift type per day
        shiftTypes.forEach(shiftType => {
          const numEmployees = Math.floor(Math.random() * 3) + 3; // 3-5 employees
          const shuffledEmployees = [...employeeIds].sort(() => 0.5 - Math.random());
          const selectedEmployees = shuffledEmployees.slice(0, numEmployees);
          
          selectedEmployees.forEach(employeeId => {
            sampleShifts.push({
              ShiftID: this.generateShiftId(),
              EmployeeID: employeeId,
              Date: dateStr,
              ShiftType: shiftType,
              StartTime: this.getStartTime(shiftType),
              EndTime: this.getEndTime(shiftType)
            });
          });
        });
      }
      
      // Add to existing shifts
      const existingShifts = this.shiftsSignal();
      this.shiftsSignal.set([...existingShifts, ...sampleShifts]);
      this.saveToStorage();
    }
  }

  private initializeSampleSwapRequests(): void {
    if (this.swapRequestsSignal().length === 0) {
      const sampleSwapRequests: ShiftSwapRequest[] = [
        {
          SwapID: 'SW001',
          EmployeeID: 'E1003',
          Date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          FromShift: 'Evening',
          ToShift: 'Morning',
          Status: 'Pending',
          RequestedBy: 'E1003'
        },
        {
          SwapID: 'SW002',
          EmployeeID: 'E1007',
          Date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          FromShift: 'Night',
          ToShift: 'Evening',
          Status: 'Approved',
          RequestedBy: 'E1007'
        },
        {
          SwapID: 'SW003',
          EmployeeID: 'E1011',
          Date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          FromShift: 'Morning',
          ToShift: 'Night',
          Status: 'Rejected',
          RequestedBy: 'E1011'
        },
        {
          SwapID: 'SW004',
          EmployeeID: 'E1005',
          Date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          FromShift: 'Evening',
          ToShift: 'Morning',
          Status: 'Pending',
          RequestedBy: 'E1005'
        }
      ];
      this.swapRequestsSignal.set(sampleSwapRequests);
      this.saveToStorage();
    }
  }

  private generateSwapId(): string {
    return 'SW' + Date.now().toString();
  }
}


