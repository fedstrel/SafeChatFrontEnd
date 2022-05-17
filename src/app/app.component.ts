import {Component, OnInit} from '@angular/core';
import {AuthMonitoringService} from "./services/event/auth-monitoring.service";
import {TokenStorageService} from "./services/global/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  isAuthenticated: boolean;

  constructor(private authMonitoringService: AuthMonitoringService,
              private tokenStorageService: TokenStorageService) {
    this.isAuthenticated = !!this.tokenStorageService.getUser();
  }

  ngOnInit(): void {
    this.authMonitoringService.userAuthenticatedEvent
      .subscribe(() => {
        this.isAuthenticated = true;
        console.log("authenticated");
      });
    this.authMonitoringService.userLoggedOutEvent
      .subscribe(() => {
        this.isAuthenticated = false;
        console.log("logged out");
      });
  }

}
