import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {Router} from "@angular/router";
import {AuthMonitoringService} from "../../services/auth-monitoring.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private authMonitoringService: AuthMonitoringService,
    private tokenService: TokenStorageService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (this.tokenService.getToken()) {
      this.authMonitoringService.userAuthenticated("user authenticated");
      this.router.navigate(['/profile']);
    }
  }

  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    })
  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  submitDataToServer(): void {
    this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(data => {
        console.log(data);
        this.tokenService.saveToken(data.token);
        this.tokenService.saveUser(data);
        this.authMonitoringService.userAuthenticated("user authenticated");
        this.router.navigate(['/profile']).then((value) => {console.log(value)});
        window.location.reload();
      });
  }
}
