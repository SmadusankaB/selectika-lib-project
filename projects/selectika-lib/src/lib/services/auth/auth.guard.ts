import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../firebased/firebase.service';


// import the auth service


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | any {
    try {
      const currentUser = this.firebaseService.currentUser;
      if (currentUser) {
        // check if the route is retricted by role
        if (currentUser == null) {
          // if there is not sign-in user
          this.router.navigate(['/login']);
        } else if (next.data.roles && next.data.roles.indexOf(currentUser.role) === -1) {
          // role not authorized
          this.router.navigate(['/home-base']);
        } else {
          return true;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
