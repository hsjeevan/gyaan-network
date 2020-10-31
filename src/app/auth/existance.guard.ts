import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ExistanceGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.getUserBelongingSchool().then(() => {
      return this.userService.userBelongingSchool.pipe(take(1)).toPromise()
        .then((arr: any) => {
          if (arr) {
            if (arr?.length) {
              return Promise.resolve(true);
              // return Promise.resolve(false);
              // this.router.navigate(['/login']);
            }
            else {
              return Promise.resolve(true);

              // this.router.navigate(['/']);
              // return Promise.resolve(true);
              // return Promise.resolve(false);
            }
          }
          else {
            this.router.navigate(['login']);
          }
        });

    })
  }

}
