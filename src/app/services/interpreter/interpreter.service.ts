import { Injectable } from '@angular/core';
import {InterpretCommands} from "./interpret.commands";
import {RoomService} from "../api/room.service";
import {UserService} from "../api/user.service";
import {InterpretCommandInfo} from "./interpret.command.info";
import {Observable, of} from "rxjs";
import {WebsocketNotificationService} from "../global/websocket-notification.service";
import {TokenStorageService} from "../global/token-storage.service";
import jwtDecode from "jwt-decode";
import {DecodedToken} from "../../models/DecodedToken";

@Injectable({
  providedIn: 'root'
})
export class InterpreterService {

  constructor(public roomService: RoomService,
              public userService: UserService,
              private wsNotificationService: WebsocketNotificationService,
              private tokenService: TokenStorageService) {
    wsNotificationService.connect(jwtDecode<DecodedToken>(this.tokenService.getUser()));
  }

  public selectCommand(text: string, curUserId: number, curRoomId: number): Observable<string> {
    let name = text.indexOf(" ") == -1 ? text : text.substring(0, text.indexOf(" "));
    console.log(name);
    switch (name) {
      case InterpretCommands[0]: {
        console.log(this.help());
        return this.help();
      }
      case InterpretCommands[1]: {
        if (text.substring(name.length).length <= 0)
          return this.roomUsers(curRoomId);
        return this.roomUsers(+text.substring(name.length));
      }
      case InterpretCommands[2]: {
        if (text.substring(name.length).length <= 0)
          return of("No arguments were found");
        return this.deleteUsers(curRoomId, curUserId, this.parseParams(text.substring(name.length)));
      }
      default: {
        return of("This command has not been found. Use /help to see the available commands.");
      }
    }
  }

  public help(): Observable<string> {
    let info: string = "You can use \"/\" to execute the following commands:";
    for (let i = 0; i < InterpretCommands.__LENGTH; i++) {
      info = info.concat("\n", InterpretCommands[i], "\n", InterpretCommandInfo.info[i]);
    }
    return of(info);
  }

  public roomUsers(roomId: number): Observable<string> {
    return new Observable<string>(subscriber => {
      let res = "Users that are present in the room:\n";
      this.userService.getAllUsersByRoomId(roomId)
        .subscribe(users => {
          console.log(users);
          if (users.length == 0) {
            subscriber.next("Room with id=" + roomId + " has not been found.");
            return;
          }

          for (let user of users) {
            res = res.concat(user.firstname, " ", user.lastname, " | id = ", user.id, "\n");
          }
          subscriber.next(res);
        });
    });
  }

  public deleteUsers(roomId: number, curUserId: number, userIds: number[]): Observable<string> {
    return new Observable<string>(subscriber => {
      if (this.arrayIncludesUser(userIds, curUserId)) {
        console.log("trying to delete yourself");
        subscriber.next("Can't delete yourself.");
        return;
      }
      this.roomService.deleteUsersFromRoom(roomId, curUserId, userIds).subscribe(response => {
        for (let userId of userIds)
          this.wsNotificationService.notifyAboutChange(userId);
        subscriber.next(response.message);
      });
    });
  }

  parseParams(params: string): number[] {
    let res: number[] = [];
    let tmp = params.split(", ");
    for (let num of tmp) {
      res.push(parseInt(num));
    }
    return res;
  }

  //.includes didn't want to work ¯＼_(ツ)_/¯
  arrayIncludesUser(userIds: number[], userId: number): boolean {
    for (let id of userIds) {
      console.log();
      if (id == userId)
        return true;
    }
    return false;
  }
}
