import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminComponent } from './admin/admin.component';
import { StudentComponent } from './student/student.component';
import { UniversityComponent } from './university/university.component';
import { DashboardComponent } from '../dashboard/dashboard.component';


@NgModule({
  declarations: [ AdminComponent, StudentComponent, UniversityComponent, DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
