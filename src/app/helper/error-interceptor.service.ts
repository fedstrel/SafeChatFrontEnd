import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenStorageService} from "../services/global/token-storage.service";
import {catchError, Observable, throwError} from "rxjs";
import {NotificationService} from "../services/global/notification.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private tokenService: TokenStorageService,
              private notificationService: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => {
      console.log(err.error.message_0);
      if (err.status == 401) {
        this.tokenService.logOut();
      }

      const error = err.error.message_0 || err.statusText;
      this.notificationService.showSnackBar(error);
      return throwError(error);
    }))
  }
}

export const autherrorInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
];
