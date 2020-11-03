import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  constructor(public authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<any> {
    // const user: any = await this.authService.userSub.pipe(take(1)).toPromise();
    this.userService.userDocSub.subscribe(data => {
      this.user = data;
    });
  }

}
