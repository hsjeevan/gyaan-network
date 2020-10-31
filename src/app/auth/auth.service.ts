import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

import { Subject } from 'rxjs';
import { UiService } from '../services/shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  roles = {
    student: false,
    university: false
  };

  // user: User;
  // authState: auth.UserCredential;
  // state: any = null;

  constructor(public afAuth: AngularFireAuth, public router: Router, private uiService: UiService, private afs: AngularFirestore) { }

  async initAuthListener(): Promise<any> {
    await this.afAuth.authState.subscribe(async user => {
      if (user) {
        await this.initilizeData(user.email);
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
        this.authChange.next(false);
        this.isAuthenticated = false;
      }
    });
  }
  registerUser(authData: any) {
    this.uiService.loadingStateChanged.next(true);
    const photoURL = `https://ui-avatars.com/api/?name=${authData.userName.split(' ').join('+')}`;
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(async result => {
        result.user.updateProfile({
          displayName: authData.userName,
          photoURL
        }).then(async () => {
          this.uiService.loadingStateChanged.next(false);
          this.roles[authData.role] = true;
          await this.createUser(result.user, photoURL, this.roles);
        });

      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  createUser(user, photo = '', role) {
    return this.afs.doc(`Users/${user.uid}`).set({
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL || photo,
      role
    }, { merge: true });
  }

  updateUserData(user) {
    return this.afs.doc(`Users/${user.uid}`).set(user, { merge: true });
  }

  login(authData: any) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(async result => {
        this.uiService.loadingStateChanged.next(false);
        const isNewUser = result.additionalUserInfo.isNewUser;
        if (isNewUser) {
          result.user.delete().then(() => {
            this.router.navigate(['/register']);
          });
        } else {
          // your sign in flow
          // await this.createUser(result.user);
        }
      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }
  webGoogleLogin() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async result => {
      const isNewUser = result.additionalUserInfo.isNewUser;
      if (isNewUser) {
        result.user.delete().then(() => {
          this.router.navigate(['/register']);
        });
      } else {
        // your sign in flow
        // await this.createUser(result.user);
      }
    })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }
  logout() {
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }


  isAuth() {
    return this.isAuthenticated;
  }
  async initilizeData(email) {
    //this.ds.initializeData(email);
  }

  async sendEmailLink(email) {
    const actionCodeSettings = {
      // Your redirect URL
      url: `${window.origin}/login`,
      handleCodeInApp: true
    };

    try {
      await this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings);
      // this.errorMessage = 'Please check your mail';
      window.localStorage.setItem('emailForSignIn', email);
      this.uiService.showSnackbar(`Login link has been sent to ${email}`, null, 3000);
      // this.emailSent = true;
    } catch (err) {
      this.uiService.showSnackbar(err.message, null, 3000);
    }
  }

  async confirmSignIn(url) {
    try {
      if (this.afAuth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');

        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        // Signin user and remove the email localStorage
        const result = await this.afAuth.signInWithEmailLink(email, url);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (err) {
      this.uiService.showSnackbar(err.message, null, 3000);
    }
  }



}
