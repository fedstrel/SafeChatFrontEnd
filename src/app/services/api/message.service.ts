import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const MESSAGE_API = 'http://localhost:8080/message/';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpclient: HttpClient) { }

  getMessagesByRoomPageable(roomId: number, pageNumber: number): Observable<any> {
    return this.httpclient.get(MESSAGE_API + 'room/' + roomId + '/page=' + pageNumber);
  }

  getAllMessagesByRoom(roomId: number): Observable<any> {
    return this.httpclient.get(MESSAGE_API + 'room/all/' + roomId);
  }
}
