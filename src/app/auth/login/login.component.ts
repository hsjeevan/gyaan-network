import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthData } from '../auth-data.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  user;
  emailSent = false;
  errorMessage: string;
  email: string;
  password: string;
  loginSuccess = false;
  error: any;
  authState: any = null;
  constructor(private authService: AuthService, public afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.user = this.afAuth.authState;
    const url = this.router.url;
    if (url.includes('signIn')) {
      this.authService.confirmSignIn(url);
    }
  }

  async googleLogin() {
    this.authService.webGoogleLogin();
  }

  sendEmailLink() {
    this.authService.sendEmailLink(this.email);
  }

  Login() {
    const data: AuthData = {
      email: this.email,
      password: this.password
    };
    this.authService.login(data);

  }

}
