import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const ROOM_API = 'http://localhost:8080/room/'

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
    return this.httpclient.delete(ROOM_API + roomId);
  }
}
