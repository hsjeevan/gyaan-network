import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);
const redirectLoggedInToRegistration = () => redirectLoggedInTo(['register']);

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToDashboard) },
  { path: 'register', component: RegisterComponent, ...canActivate(redirectLoggedInToRegistration) },
  { path: 'forgotpassword', component: ForgotPasswordComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
