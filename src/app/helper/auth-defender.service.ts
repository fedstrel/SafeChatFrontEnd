import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {TokenStorageService} from "../services/token-storage.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthDefenderService implements CanActivate {

  constructor(private router: Router,
              private tokenService: TokenStorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>
                                                                          | Promise<boolean | UrlTree>
                                                                          | boolean
                                                                          | UrlTree {
    if (this.tokenService.getUser()) {
      return true;
    }

    this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
