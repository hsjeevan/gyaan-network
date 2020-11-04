import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, OnDestroy {

  searchedList: any = [];
  universities: any = [];
  currentUser: any;
  chatSub: Subscription;
  chatMessages: any = [];
  selectedUser: any;
  text = '';
  subscriptions: Subscription[] = [];

  constructor(private afs: AngularFirestore, private userService: UserService) { }

  ngOnInit(): any {
    this.subscriptions.push(this.userService.userDocSub.subscribe(data => {
      this.currentUser = data;
    }));
    this.getUniversities();

  }

  getChat(user) {
    this.selectedUser = user;
    const chatID = this.currentUser.uid > user.uid ? this.currentUser.uid + user.uid : user.uid + this.currentUser.uid;
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
    this.chatSub = this.afs.collection('GyaanConversations').doc(chatID).valueChanges().subscribe((data: any) => {
      console.log('Here');

      this.chatMessages = data?.Messages?.reverse() || [];
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
      Messages: firebase.firestore.FieldValue.arrayUnion(data)
    };
    this.afs.collection('GyaanConversations').doc(chatID)
      .set(messageData, { merge: true }).then(() => this.text = '');
  }

  getUniversities() {
    this.subscriptions.push(this.afs.collection('GyaanUsers', ref => ref.where('role', 'not-in', ['admin', 'student'])).stateChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(data => {
      if (data.length > this.universities.length) {
        this.universities = this.mergeArr(data, this.universities);
      } else {
        this.universities = this.mergeArr(this.universities, data);
      }
      this.searchedList = this.universities;
      this.getChat(this.universities[0]);
    }));
  }

  mergeArr(a1, a2) {
    return a1.map(t1 => ({ ...t1, ...a2.find(t2 => t2.id === t1.id) }));
  }

  search(value: string) {
    this.searchedList = this.universities.filter(
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
