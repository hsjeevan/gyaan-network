import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../auth/role.guard';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard.component';
import { StudentComponent } from './student/student.component';
import { UniversityComponent } from './university/university.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'student', pathMatch: 'full' },
      {
        path: 'admin', component: AdminComponent,
        canActivate: [RoleGuard], data: {
          role: 'admin'
        }
      },
      {
        path: 'student', component: StudentComponent,
        canActivate: [RoleGuard], data: {
          role: 'student'
        }
      },
      {
        path: 'university', component: UniversityComponent,
        canActivate: [RoleGuard], data: {
          role: 'university'
        }
      },
      {
        path: '**', component: StudentComponent

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
