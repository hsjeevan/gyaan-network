import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  userEmail: any;
  constructor(public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  ForgotPassword() {
    const actionCodeSettings = {
      // Your redirect URL
      url: `${window.origin}/login`,
      handleCodeInApp: true
    };
    return this.afAuth.sendPasswordResetEmail(
      this.userEmail,
      actionCodeSettings
    ).then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

}
