import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {WebsocketService} from "../../services/global/websocket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {WSMessage} from "../../models/WSMessage";
import {TokenStorageService} from "../../services/global/token-storage.service";
import {DecodedToken} from "../../models/DecodedToken";
import jwtDecode from "jwt-decode";
import {MessageService} from "../../services/api/message.service";
import {Message} from "../../models/Message";
import {ShortUser} from "../../models/ShortUser";
import {Room} from "../../models/Room";
import {ShortMessage} from "../../models/ShortMessage";
import {InterpreterService} from "../../services/interpreter/interpreter.service";
import {WebsocketNotificationService} from "../../services/global/websocket-notification.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy, AfterContentChecked{

  private routeSub!: Subscription;
  private shouldScroll: boolean = true;
  private compScrolling: boolean = false;

  public curRoom: Room;
  public curPage: number = 0;
  public decodedToken: DecodedToken;
  private admin: boolean;

  public usersInCurSession: ShortUser[] = [];

  public oldRoomMessages: Message[] = [];
  public roomMessages: ShortMessage[] = [];


  constructor(private wsService: WebsocketService,
              private wsNService: WebsocketNotificationService,
              private messageService: MessageService,
              private interpreterService: InterpreterService,
              private tokenService: TokenStorageService,
              private route: ActivatedRoute,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.decodedToken = jwtDecode<DecodedToken>(this.tokenService.getUser());

      this.leaveIfDeleted(this.decodedToken.id, params['id']);

      this.interpreterService.roomService.getRoomById(params['id']).subscribe(room => {
        this.curRoom = room;
        this.interpreterService.roomService.getIfUserIsAdminOfTheRoom(this.decodedToken.id, room.id).subscribe(res => {
          this.admin = res;
        });
        this.wsNService.connect(this.decodedToken);
        this.wsNService.notificationReceivedEvent.subscribe(() => {
          this.leaveIfDeleted(this.decodedToken.id, this.curRoom.id);
        });
      });

      this.wsService.connect(params['id'], this.decodedToken);
      this.wsService.messageReceivedEvent.subscribe((message) => {
        this.showMessage(message);
      });


      this.messageService.getMessagesByRoomPageable(params['id'], this.curPage).subscribe(messages => {
        this.oldRoomMessages = messages.content;
        this.oldRoomMessages.reverse();
      });
    });

    const that = this;
    let elem = this.getHTMLElementOrBody("allMessagesContainer");
    elem.addEventListener("scroll", function () {that.scrollHandler()}, false);
  }

  ngAfterContentChecked() {
    if (this.getHTMLElementOrBody("allMessagesContainer").scrollHeight > window.innerHeight
      && this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.wsService.disconnect();
    this.wsNService.disconnect();
  }

  leaveIfDeleted(userId: number, roomId: number) {
    this.interpreterService.roomService.getIfUserIsPresentInTheRoom(userId, roomId).subscribe((res) => {
      if (!res)
        this.router.navigate(["/profile"]);
    });
  }

  sendMessage(mesInput: HTMLInputElement) {
    let text = mesInput.value.trim();
    if (text.charAt(0) !== "/") {
      if (this.curRoom.roomType.toString() == "ROOM_TYPE_CHANNEL" && !this.admin) {
        this.showMessage(new WSMessage("Not allowed to write to the channel", "1"));
        mesInput.value = "";
        return;
      }
      this.wsService.sendMessage(this.decodedToken.id, text);
      mesInput.value = "";
      return;
    }
    text = text.substring(1);
    this.interpreterService.selectCommand(text, this.decodedToken.id, this.curRoom.id).subscribe(output => {
      this.showMessage(new WSMessage(output, "1")); //id of a special interpreter user
    });
    mesInput.value = "";
  }

  scrollToBottom() {
    let cont = this.getHTMLElementOrBody("allMessagesContainer");
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

    this.interpreterService.userService.getUserById(userId).subscribe(user => {
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

  loadOlderMessages() {
    this.curPage++;
    this.messageService.getMessagesByRoomPageable(this.curRoom.id, this.curPage).subscribe(messages => {
      if (!messages.empty) {
        this.oldRoomMessages = messages.content.reverse().concat(this.oldRoomMessages);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  checkKeyInput(event: KeyboardEvent, mesInput: HTMLInputElement) {
    if (event.code === "Enter")
      this.sendMessage(mesInput);
  }

  scrollHandler() {
    if (!this.compScrolling) {
      this.compScrolling = true;

      if (this.getHTMLElementOrBody("allMessagesContainer").scrollTop < 10) {
        this.loadOlderMessages();
      }
    }
    this.compScrolling = false;
  }

  getHTMLElementOrBody(id: string):HTMLElement {
    let cont = document.getElementById(id);
    return cont ? cont : document.body;
  }
}
