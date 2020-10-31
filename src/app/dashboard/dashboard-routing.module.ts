import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard.component';
import { StudentComponent } from './student/student.component';
import { UniversityComponent } from './university/university.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      { path: 'admin', component: AdminComponent },
      { path: 'student', component: StudentComponent },
      { path: 'university', component: UniversityComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
