import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthMonitoringService {

  @Output() userAuthenticatedEvent = new EventEmitter<string>();
  @Output() userLoggedOutEvent = new EventEmitter<string>();

  constructor() { }

  userAuthenticated(msg: string) {
    this.userAuthenticatedEvent.emit(msg);
  }

  userLoggedOut(msg: string) {
    this.userLoggedOutEvent.emit(msg);
  }
}
