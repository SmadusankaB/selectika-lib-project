import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { roles, routeEndPoints, fireStore } from '../auth/constants';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public currentUser: any;
  public userStatus!: string;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);


  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router) {
  }

  // this is called when app start or page re-loading
  userChanges(): void {
    this.afAuth.onAuthStateChanged((currUser: any) => {
      // get current authState and if there is user
      if (currUser) {
        // take a snapshot, if there is a user in auth state
        this.firestore.collection(fireStore.collection).ref.where(fireStore.key, '==', currUser.email).onSnapshot((snap: any) => {
          snap.forEach((userRef: any) => {
            // set current user
            this.currentUser = userRef.data();

            // set UserStatus
            this.setUserStatus(this.currentUser);
            // console.log(this.userStatus);

            if (userRef.data().role !== roles.admin) { // for future usage. this can be used to redirect user based on user type
              this.ngZone.run(() => this.router.navigate([routeEndPoints.homeBase]));
            } else {
              this.ngZone.run(() => this.router.navigate([routeEndPoints.homeBase]));
            }
          });
        });
      } else {
        this.ngZone.run(() => this.router.navigate([routeEndPoints.login]));
      }
    });
  }

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus; // current user
    this.userStatusChanges.next(userStatus); // current user
  }

  login(email: string, password: string): void {

    // check email, password auth
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((user: any) => { // take the user from firestore collection
        this.firestore.collection(fireStore.collection).ref.where(fireStore.key, '==', user.user?.email).onSnapshot((snap: any) => {
          snap.forEach((userRef: any) => {
            // console.log('userRef', userRef.data());
            this.currentUser = userRef.data();
            // setUserStatus
            this.setUserStatus(this.currentUser);
            if (userRef.data().role !== roles.admin) { // for future usage. this can be used to redirect user based on user type
              this.router.navigate([routeEndPoints.homeBase]);
            } else {
              this.router.navigate([routeEndPoints.homeBase]);
            }
          });
        });

      }).catch((err: any) => {
        console.log(err);
        alert(err.message);
      });
  }

  logOut(): void {
    this.afAuth.signOut()
      .then(() => {
        console.log('user signed Out successfully');
        // set current user to null to be logged out
        this.currentUser = null;
        // set the listenener to be null, for the UI to react
        this.setUserStatus(null);
        this.ngZone.run(() => this.router.navigate([routeEndPoints.login]));

      }).catch((err: any) => {
        console.log(err);
        alert(err.message);
      });
  }

}
