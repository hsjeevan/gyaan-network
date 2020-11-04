import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  userProfile: any;
  usersArr = [];
  searchedList: any;
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService, private afs: AngularFirestore) { }

  ngOnInit(): any {
    this.subscriptions.push(this.userService.userDocSub.subscribe(data => this.userProfile = data));
    this.getUsers();
  }

  getUsers() {
    this.subscriptions.push(this.afs.collection('GyaanUsers', ref => ref.where('role', '!=', 'admin')).stateChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(data => {
      if (data.length > this.usersArr.length) {
        this.usersArr = this.mergeArr(data, this.usersArr);
      } else {
        this.usersArr = this.mergeArr(this.usersArr, data);
      }
      this.searchedList = this.usersArr;
    }));
  }

  increment(user) {
    this.afs.collection('GyaanUsers').doc(user.uid).set({ blocked: firebase.firestore.FieldValue.increment(1) }, { merge: true });
  }
  search(value: string) {
    this.searchedList = this.usersArr.filter(
      val =>
        val.displayName.toLowerCase().includes(value.toLowerCase()) ||
        val.email.toLowerCase().includes(value.toLowerCase()) ||
        val.role.toLowerCase().includes(value.toLowerCase())
    );
  }

  mergeArr(a1, a2) {
    return a1.map(t1 => ({ ...t1, ...a2.find(t2 => t2.id === t1.id) }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => { if (subscription) { subscription.unsubscribe(); } });
  }

}
