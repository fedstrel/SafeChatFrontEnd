import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const USER_API = 'https://fathomless-ridge-03736.herokuapp.com/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient: HttpClient) { }

  getCurrentUser(): Observable<any> {
    return this.httpclient.get(USER_API + 'cur');
  }

  getUserById(id: number): Observable<any> {
    return this.httpclient.get(USER_API + id);
  }

  getUserByMessageId(mesId: number): Observable<any> {
    return this.httpclient.get(USER_API + 'message/' + mesId);
  }

  getAllUsersByRoomId(roomId: number): Observable<any> {
    return this.httpclient.get(USER_API + 'room/' + roomId);
  }

  getAllUsersContainingNameAndNotInTheRoom(roomId: number, name: string): Observable<any> {
    return this.httpclient.get(USER_API + 'room/' + roomId + '/search=' + name);
  }

  updateUser(user: any): Observable<any> {
    return this.httpclient.post(USER_API + 'update', user);
  }

  deleteUser(id: number): Observable<any> {
    return this.httpclient.post(USER_API + id + '/delete', '');
  }

  deleteCurUser(): Observable<any> {
    return this.httpclient.post(USER_API + 'cur/delete', '');
  }
}
