import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.scss']
})
export class UniversityComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  searchedList: any = [];
  students: any = [];
  currentUser: any;
  chatSub: Subscription;
  chatMessages: any;
  selectedUser: any;
  text = '';
  constructor(private afs: AngularFirestore, private userService: UserService) { }

  ngOnInit(): any {
    this.subscriptions.push(this.userService.userDocSub.subscribe(data => { this.currentUser = data; }));
    this.getStudents();
  }

  getChat(user) {
    this.selectedUser = user;
    const chatID = this.currentUser.uid > user.uid ? this.currentUser.uid + user.uid : user.uid + this.currentUser.uid;
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
    this.chatSub = this.afs.collection('GyaanConversations').doc(chatID).valueChanges().subscribe((data: any) => {
      this.chatMessages = data?.Messages || [];
    });
    this.subscriptions.push(this.chatSub);
  }


  writeChat() {
    const { displayName, email, photoURL, uid } = this.selectedUser;
    const chatID = this.currentUser.uid > uid ? this.currentUser.uid + uid : uid + this.currentUser.uid;
    const data = {
      text: this.text,
      sender: this.currentUser.uid,
      time: new Date(),
    };
    const messageData = {
      // users: {
      //   [`${uid}`]: { displayName, email, photoURL, uid },
      //   [`${this.currentUser.uid}`]:
      //   {
      //     displayName: this.currentUser.displayName,
      //     email: this.currentUser.email,
      //     photoURL: this.currentUser.photoURL,
      //     uid: this.currentUser.uid
      //   }
      // },
      Messages: firebase.firestore.FieldValue.arrayUnion(data)
    };
    this.afs.collection('GyaanConversations').doc(chatID)
      .set(messageData, { merge: true }).then(() => this.text = '');
  }

  getStudents() {
    this.subscriptions.push(this.afs.collection('GyaanUsers',
      ref => ref.where('role', 'not-in', ['admin', 'university'])).stateChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      ).subscribe(data => {
        if (data.length > this.students.length) {
          this.students = this.mergeArr(data, this.students);
        } else {
          this.students = this.mergeArr(this.students, data);
        }
        this.searchedList = this.students;
        this.getChat(this.students[0]);
      }));
  }

  mergeArr(a1, a2) {
    return a1.map(t1 => ({ ...t1, ...a2.find(t2 => t2.id === t1.id) }));
  }

  search(value: string) {
    this.searchedList = this.students.filter(
      val =>
        val.displayName.toLowerCase().includes(value.toLowerCase())
      //  ||
      // val.email.toLowerCase().includes(value.toLowerCase()) ||
      // val.role.toLowerCase().includes(value.toLowerCase())
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => { if (subscription) { subscription.unsubscribe(); } });
  }
}
