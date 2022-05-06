import {EventEmitter, Injectable, Output} from '@angular/core';
import {Room} from "../models/Room";

@Injectable({
  providedIn: 'root'
})
export class NavigationMonitoringService {

  @Output() roomListChangedEvent = new EventEmitter<string>();
  @Output() roomSearchListChangedEvent = new EventEmitter<Room[]>();
  @Output() confirmUserAdditionEvent = new EventEmitter<number[]>();

  constructor() { }

  roomListChanged(msg: string) {
    this.roomListChangedEvent.emit(msg);
  }

  roomSearchListChanged(roomInfo: Room[]) {
    this.roomSearchListChangedEvent.emit(roomInfo);
  }

  confirmUserAddition(userInfo: number[]) {
    this.confirmUserAdditionEvent.emit(userInfo);
  }
}
