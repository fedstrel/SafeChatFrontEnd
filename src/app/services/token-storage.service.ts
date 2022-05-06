import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

const KEY_TOKEN = 'auth-token';
const KEY_USER = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private router: Router) { }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(KEY_TOKEN);
    window.sessionStorage.setItem(KEY_TOKEN, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(KEY_TOKEN);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(KEY_USER);
    window.sessionStorage.setItem(KEY_USER, JSON.stringify(user));
  }

  public getUser(): any {
    let userToken = <string>sessionStorage.getItem(KEY_USER);
    if (userToken)
      return (userToken).split(' ')[1];
    return userToken;
  }

  logOut(): void {
    this.router.navigate(["/"]);
    window.sessionStorage.clear();
  }
}
