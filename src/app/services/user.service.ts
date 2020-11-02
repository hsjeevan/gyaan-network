import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDocSub = new ReplaySubject(1);

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { this.getUserDoc(); }

  async getUserDoc() {
    const user = await this.afAuth.user.pipe(take(1)).toPromise();
    if (user) {
      this.afs.collection('GyaanUsers').doc(user.uid).valueChanges().subscribe(userDoc => {
        this.userDocSub.next(userDoc);
      });
    }
  }
  getUserRole() {
    return this.userDocSub.pipe(take(1)).toPromise().then((user: any) => {
      return user.role;
    });
  }
}
