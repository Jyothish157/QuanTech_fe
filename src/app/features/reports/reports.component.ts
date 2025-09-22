import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { LeaveService } from '../../services/leave.service';
import { ShiftService } from '../../services/shift.service';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { DownloadService } from '../../services/download.service';
import { Attendance } from '../../models/attendance.model';
import { LeaveRequest } from '../../models/leave.model';
import { Shift } from '../../models/shift.model';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  currentEmployee: any;
  isManager = false;

  // Chart configurations
  public pieChartOptions: Partial<any>;
  public leaveChartOptions: Partial<any>;

  constructor(
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private shiftService: ShiftService,
    private employeeService: EmployeeService,
    private auth: AuthService,
    private downloadService: DownloadService
  ) {
    this.currentEmployee = this.employeeService.getCurrentUser();
    this.isManager = this.auth.currentUser()?.role === 'manager';

    // Initialize Line Chart Options for Month-wise Leave
    this.leaveChartOptions = {
      series: [{
        name: 'Leave Count',
        data: this.generateMonthWiseLeaveData()
      }],
      chart: {
        type: 'line',
        height: 320,
        width: '100%',
        zoom: {
          enabled: true
        },
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'smooth',
          speed: 800
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2.5,
        colors: ['#3B82F6']
      },
      markers: {
        size: 4,
        strokeWidth: 0,
        hover: {
          size: 6
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px'
          },
          rotateAlways: false,
          hideOverlappingLabels: true
        },
        tickAmount: 12
      },
      yaxis: {
        title: {
          text: 'Number of Leaves',
          style: {
            fontSize: '12px',
            fontWeight: 500
          }
        },
        min: 0,
        tickAmount: 5,
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px'
          },
          formatter: (value: number) => Math.round(value)
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          title: {
            formatter: () => 'Leaves'
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 20
        }
      }
    };

    // Initialize Pie Chart Options for Leave Distribution
    this.pieChartOptions = {
      series: this.generateLeaveData().percentages,
      chart: {
        type: 'pie',
        height: 380
      },
      labels: this.generateLeaveData().labels,
      colors: ['#F87171', '#60A5FA', '#C084FC'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val.toFixed(1) + '%';
        }
      }
    };
  }

  get attendanceData(): Attendance[] {
    return this.attendanceService.getAttendance();
  }

  get leaveData(): LeaveRequest[] {
    return this.leaveService.getLeaveRequests();
  }

  get shiftData(): Shift[] {
    return this.shiftService.getShifts();
  }

  private generateMonthWiseLeaveData(): number[] {
    const year = 2025; // Current year
    const months = Array.from({ length: 12 }, (_, i) => {
      return new Date(year, i, 1);
    });

    return months.map(date => {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      return this.leaveData.filter(leave => {
        const leaveDate = new Date(leave.StartDate);
        return leaveDate >= startDate && leaveDate <= endDate && leave.Status === 'Approved';
      }).length;
    });
  }

  private generateLeaveData() {
    const leaveTypes = ['Sick', 'Vacation', 'Casual'];
    const leaves = this.leaveData.filter(l => l.Status === 'Approved');
    const totalLeaves = leaves.length;
    
    const data = leaveTypes.map(type => {
      const count = leaves.filter(l => l.LeaveType === type).length;
      const percentage = totalLeaves > 0 ? (count / totalLeaves) * 100 : 0;
      return { type, count, percentage: Math.round(percentage) };
    });

    return {
      percentages: data.map(item => item.percentage),
      labels: data.map(item => item.type)
    };
  }

  downloadAttendanceReport() {
    const data = this.getEmployees().map(employee => ({
      EmployeeID: employee.EmployeeID,
      Name: this.getEmployeeName(employee.EmployeeID),
      DaysWorked: this.getEmployeeAttendanceDays(employee.EmployeeID),
      TotalHours: this.getEmployeeTotalHours(employee.EmployeeID),
      AverageHours: this.getEmployeeAverageHours(employee.EmployeeID)
    }));

    this.downloadService.downloadAsPDF('attendance_report', data);
  }

  get totalWorkHours(): number {
    return this.attendanceData
      .filter(a => a.WorkHours)
      .reduce((total, a) => total + (a.WorkHours || 0), 0);
  }

  get averageWorkHours(): number {
    const completedDays = this.attendanceData.filter(a => a.WorkHours).length;
    return completedDays > 0 ? Math.round((this.totalWorkHours / completedDays) * 100) / 100 : 0;
  }

  get pendingLeaveRequests(): number {
    return this.leaveData.filter(l => l.Status === 'Pending').length;
  }

  get approvedLeaveRequests(): number {
    return this.leaveData.filter(l => l.Status === 'Approved').length;
  }

  get shiftCoverage(): { shift: string; coverage: number }[] {
    const shifts = ['Morning', 'Evening', 'Night'];
    const totalDays = 7; // Last 7 days
    
    return shifts.map(shift => {
      const shiftCount = this.shiftData.filter(s => s.ShiftType === shift).length;
      const coverage = (shiftCount / (totalDays * this.employeeService.getEmployees().length)) * 100;
      return { shift, coverage: Math.round(coverage) };
    });
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employeeService.getEmployee(employeeId);
    return employee ? employee.Name : employeeId;
  }

  getTotalDaysWorked(): number {
    return this.attendanceData.filter(a => a.WorkHours).length;
  }

  getEmployees(): any[] {
    return this.employeeService.getEmployees();
  }

  getEmployeeAttendanceDays(employeeId: string): number {
    return this.attendanceData.filter(a => a.EmployeeID === employeeId).length;
  }

  getEmployeeTotalHours(employeeId: string): number {
    return this.attendanceData
      .filter(a => a.EmployeeID === employeeId && a.WorkHours)
      .reduce((total, a) => total + (a.WorkHours || 0), 0);
  }

  getEmployeeAverageHours(employeeId: string): number {
    const workedDays = this.attendanceData.filter(a => a.EmployeeID === employeeId && a.WorkHours);
    if (workedDays.length === 0) return 0;
    
    const totalHours = workedDays.reduce((total, a) => total + (a.WorkHours || 0), 0);
    return Math.round((totalHours / workedDays.length) * 100) / 100;
  }
}


