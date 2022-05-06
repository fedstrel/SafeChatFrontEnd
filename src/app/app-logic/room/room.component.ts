import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {WSMessage} from "../../models/WSMessage";
import {TokenStorageService} from "../../services/token-storage.service";
import {DecodedToken} from "../../models/DecodedToken";
import jwtDecode from "jwt-decode";
import {MessageService} from "../../services/message.service";
import {Message} from "../../models/Message";
import {UserService} from "../../services/user.service";
import {ShortUser} from "../../models/ShortUser";
import {RoomService} from "../../services/room.service";
import {Room} from "../../models/Room";
import {ShortMessage} from "../../models/ShortMessage";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy{

  private routeSub!: Subscription;
  public curRoom: Room;
  public decodedToken: DecodedToken;
  public inputValue: string;
  public usersInCurSession: ShortUser[] = [];
  public oldRoomMessages: Message[] = [];
  public roomMessages: ShortMessage[] = [];

  constructor(private wsService: WebsocketService,
              private messageService: MessageService,
              private userService: UserService,
              private roomService: RoomService,
              private tokenService: TokenStorageService,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.roomService.getRoomById(params['id']).subscribe(room => {
        this.curRoom = room;
      });
      this.wsService.connect(params['id']);
      this.messageService.getAllMessagesByRoom(params['id']).subscribe(messages => {
        this.oldRoomMessages = messages;
        console.log(this.oldRoomMessages);
        this.scrollToBottom();
      });
    });
    this.wsService.messageReceivedEvent.subscribe((message) => {
      this.showMessage(message);
    });
    this.decodedToken = jwtDecode<DecodedToken>(this.tokenService.getUser());
    console.log(this.decodedToken);
    this.inputValue = "";
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.wsService.disconnect();
  }

  sendMessage(mesText: string) {
    this.inputValue = " ";
    mesText.trim();
    this.wsService.sendMessage(this.decodedToken.id, mesText);
  }

  scrollToBottom() {
    let cont = document.getElementById("allMessagesContainer");
    cont = cont ? cont : document.body;
    console.log(cont.scrollHeight);
    cont.scrollTo(0, cont.scrollHeight);
  }

  showMessage(message: WSMessage): void {
    const userId = +message.senderId;

    for (let user of this.usersInCurSession) {
      if (user.id == userId) {
        this.addUserNameAndShow(user, message);
        return;
      }
    }

    this.userService.getUserById(userId).subscribe(user => {
      const newUser = new ShortUser(user.id, user.firstname, user.lastname);
      this.usersInCurSession.push(newUser);
      this.addUserNameAndShow(newUser, message);
    });
  }

  addUserNameAndShow(user: ShortUser, message: WSMessage) {
    let sm = new ShortMessage(+message.senderId, user.firstname + " " + user.lastname, message.message);
    this.roomMessages.push(sm);
    this.changeDetectorRef.detectChanges();
    this.scrollToBottom();
  }
}
