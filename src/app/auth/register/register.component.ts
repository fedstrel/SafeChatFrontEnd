import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/api/auth.service";
import {TokenStorageService} from "../../services/global/token-storage.service";
import {AuthMonitoringService} from "../../services/event/auth-monitoring.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private authMonitoringService: AuthMonitoringService,
    private tokenService: TokenStorageService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (this.tokenService.getUser()) {
      this.authMonitoringService.userAuthenticated("user authenticated");
      this.router.navigate(['/profile']);
    }
  }

  createRegisterForm(): FormGroup {
    return this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      info: [''],
    })
  }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  submitDataToServer(): void {
    this.authService.register({
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
      email: this.registerForm.value.email,
      info: this.registerForm.value.info
    }).subscribe(() => {
        this.authService.login({
          username: this.registerForm.value.username,
          password: this.registerForm.value.password
        }).subscribe((data) => {
          this.tokenService.saveToken(data.token);
          this.tokenService.saveUser(data);
          this.authMonitoringService.userAuthenticated("user authenticated");
          this.router.navigate(['/profile']).then((value) => {console.log(value)});
        });
      });
  }
}
