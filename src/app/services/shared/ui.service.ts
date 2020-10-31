import { Injectable, } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loadingStateChanged = new Subject<boolean>();
  constructor(
    private snackbar: MatSnackBar
  ) { }

  // async showSnackbar(message, duration) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: duration
  //   });
  //   toast.present();
  // }
  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration
    });
  }

}
