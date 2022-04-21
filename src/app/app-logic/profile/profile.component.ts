import { Component, OnInit } from '@angular/core';
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthMonitoringService} from "../../services/auth-monitoring.service";
import {TokenStorageService} from "../../services/token-storage.service";

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
      });
  }

  deleteAccount() {
    console.log("*");
    this.userService.deleteCurUser()
      .subscribe(() => {
        this.tokenService.logOut();
      });
    console.log("**");
    this.authMonitoringService.userLoggedOut("The account as been deleted :_(");
    console.log("***");
    this.router.navigate(['/']);
  }
}
