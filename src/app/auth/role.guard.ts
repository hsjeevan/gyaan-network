import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole = route.data.role;
    if (this.authService.isAuthenticated) {
      return this.userService.getUserRole().then(userRole => {
        // console.log(userRole.blocked % 2 === 0);

        if (expectedRole === userRole) {
          return Promise.resolve(true);
        }
        this.router.navigate([`dashboard/${userRole}`]);
        // return Promise.resolve(false);
      });

    } else {
      this.router.navigate(['login']);
      return Promise.resolve(false);
    }
  }

}
