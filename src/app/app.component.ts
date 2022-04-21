import {Component, OnInit} from '@angular/core';
import {AuthMonitoringService} from "./services/auth-monitoring.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  isAuthenticated: boolean = false;

  constructor(private authMonitoringService: AuthMonitoringService) {
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
