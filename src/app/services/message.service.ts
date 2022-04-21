import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const MESSAGE_API = 'http://localhost:8080/message/';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpclient: HttpClient) { }

  //test this
  getMessagesByRoomPageable(roomId: number): Observable<any> {
    return this.httpclient.get(MESSAGE_API + 'room/' + roomId);
  }

  getAllMessagesByRoom(roomId: number): Observable<any> {
    return this.httpclient.get(MESSAGE_API + 'room/all/' + roomId);
  }

  createMessage(roomId: number, userId: number, messageDTO: any): Observable<any> {
    return this.httpclient.post(MESSAGE_API + 'create/' + roomId + '/' + userId, messageDTO);
  }
}
