import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { LeaveType } from '../../models/leave.model';


@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css']
})
export class LeaveRequestsComponent {
  types: LeaveType[] = ['Sick','Vacation','Casual'];
  form = { type: 'Sick' as LeaveType, from: '', to: '', reason: '' };
  constructor(private leave: LeaveService) {}
  get requests(){ return this.leave.requests(); }

  submit(){
    this.leave.submitRequest(this.form.type, this.form.from, this.form.to, this.form.reason);
    this.form = { type: 'Sick', from: '', to: '', reason: '' };
  }

  calcDays(from: string, to: string){
    if(!from || !to) return 0;
    const a = new Date(from).getTime();
    const b = new Date(to).getTime();
    const days = Math.round((b - a) / (1000*60*60*24)) + 1;
    return Math.max(days, 1);
  }
}


