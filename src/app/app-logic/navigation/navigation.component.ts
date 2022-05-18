import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {TokenStorageService} from "../../services/global/token-storage.service";
import {Router} from "@angular/router";
import {UserService} from "../../services/api/user.service";
import {AuthMonitoringService} from "../../services/event/auth-monitoring.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  user!: User;

  constructor(private tokenService: TokenStorageService,
              private authMonitoringService: AuthMonitoringService,
              private userService: UserService,
              private router: Router) {
    this.isLoggedIn = !!this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.subscribeForEvents();

    if(this.isLoggedIn) {
      this.userService.getCurrentUser()
        .subscribe(userData => {
          this.user = userData;
        })
    }
  }

  ngOnDestroy() {
    this.router.dispose();
  }

  subscribeForEvents() {
    this.authMonitoringService.userAuthenticatedEvent
      .subscribe(() => {
        this.isLoggedIn = true;
      });
    this.authMonitoringService.userLoggedOutEvent
      .subscribe(() => {
        this.isLoggedIn = false;
      });
  }

  logout(): void {
    this.tokenService.logOut();
    this.isLoggedIn = false;
    this.authMonitoringService.userLoggedOut("Logged out");
    this.router.navigate(['/login']);
  }
}
