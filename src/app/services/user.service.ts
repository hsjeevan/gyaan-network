import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ReplaySubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDocSub = new ReplaySubject(1);
  subscriptions: Subscription[] = [];

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { this.getUserDoc(); }

  async getUserDoc() {
    const user = await this.afAuth.user.pipe(take(1)).toPromise();
    if (user) {
      this.subscriptions.push(this.afs.collection('GyaanUsers').doc(user.uid).valueChanges().subscribe(userDoc => {
        if (userDoc) {
          this.userDocSub.next(userDoc);
        }
      }));
    }
  }
  getUserRole() {

    return new Promise((resolve, reject) => {
      this.userDocSub.subscribe((data: any) => {
        if (data?.role) {
          resolve(data?.role);
        }
      });
    });
  }

  onDestoy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
