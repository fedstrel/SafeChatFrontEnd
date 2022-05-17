import { Component, OnInit } from '@angular/core';
import {User} from "../../models/User";
import {UserService} from "../../services/api/user.service";
import {Router} from "@angular/router";
import {AuthMonitoringService} from "../../services/event/auth-monitoring.service";
import {TokenStorageService} from "../../services/global/token-storage.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: User;

  constructor(private userService: UserService,
              private tokenService: TokenStorageService,
              private router: Router,
              private authMonitoringService: AuthMonitoringService) {  }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        console.log(data);
      }, error => {
        console.log("profile not found");
        this.tokenService.logOut();
      });
  }

  deleteAccount() {
    this.userService.deleteCurUser()
      .subscribe(() => {
        this.tokenService.logOut();
      });
    this.authMonitoringService.userLoggedOut("The account as been deleted :_(");
    this.router.navigate(['/']);
  }
}
