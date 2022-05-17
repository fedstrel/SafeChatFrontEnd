import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const ROOM_API = 'https://fathomless-ridge-03736.herokuapp.com/room/'

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private httpclient: HttpClient) { }

  getRoomById(id: number): Observable<any> {
    return this.httpclient.get(ROOM_API + id);
  }

  getAllRoomsContainingName(name: string): Observable<any>  {
    return this.httpclient.get(ROOM_API + 'search=' + name);
  }

  getAllRoomsByUserIdAndName(userId: number, name: string): Observable<any> {
    return this.httpclient.get(ROOM_API + 'search=' + name + '/' + userId);
  }

  getAllRoomsByUserId(userId: number): Observable<any> {
    return this.httpclient.get(ROOM_API + 'user/' + userId);
  }

  getIfUserIsAdminOfTheRoom(userId: number, roomId: number): Observable<any> {
    return this.httpclient.get(ROOM_API + 'user/' + userId + '/admin/' + roomId);
  }

  getIfUserIsPresentInTheRoom(userId: number, roomId: number): Observable<any> {
    return this.httpclient.get(ROOM_API + 'user/' + userId + '/present/' + roomId);
  }

  createRoom(userId: number, roomDTO: any): Observable<any>  {
    return this.httpclient.post(ROOM_API + 'create/' + userId, roomDTO);
  }

  addUsersToRoom(roomId: number, userIds: any): Observable<any> {
    return this.httpclient.post(ROOM_API + 'add/' + roomId, userIds);
  }

  deleteUsersFromRoom(roomId: number, userId: number, userIds: any): Observable<any> {
    return this.httpclient.post(ROOM_API + 'delete/' + roomId + '/user/' + userId, userIds);
  }

  deleteRoom(roomId: number, userId: number): Observable<any> {
    return this.httpclient.delete(ROOM_API + roomId + '/user/' + userId);
  }

  leaveRoom(roomId: number): Observable<any> {
    return this.httpclient.post(ROOM_API + 'leave/' + roomId, '');
  }
}
