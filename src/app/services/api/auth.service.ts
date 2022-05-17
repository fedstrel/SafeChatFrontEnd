import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const AUTH_API = 'http://localhost:8080/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpclient: HttpClient) { }

  public login(user: any): Observable<any> {
    return this.httpclient.post(AUTH_API + '/signin', {
      username: user.username,
      password: user.password
    });
  }

  public register(user: any): Observable<any> {
    return this.httpclient.post(AUTH_API + '/signup', {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      password: user.password,
      confirmPassword: user.confirmPassword,
      email: user.email,
      info: user.info
    });
  }
}
