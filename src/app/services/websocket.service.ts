import {EventEmitter, Injectable, Output} from '@angular/core';
import {WSMessage} from "../models/WSMessage";
import * as SockJS from "sockjs-client";
import {CompatClient, Stomp, StompConfig} from "@stomp/stompjs";

const WS_ENDPOINT = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  @Output() messageReceivedEvent = new EventEmitter<WSMessage>();

  public stompClient: CompatClient;
  private roomId: number;

  connect(roomId: number) {
    this.roomId = roomId;
    let config = new StompConfig();

    let socket = new SockJS(WS_ENDPOINT + '/chat');
    this.stompClient = Stomp.over(socket);
    this.stompClient.configure(config);
    this.stompClient.connect({}, () => {
      this.trySubscribing(roomId);
    });
  }

  trySubscribing(roomId: number) {
    this.stompClient.subscribe("/topic/messages/" + roomId, response => {
      let data = JSON.parse(response.body);
      let message = new WSMessage(data.message, data.senderId);
      this.messageReceivedEvent.emit(message);
    });
    console.log(this.stompClient.connected);
  }

  sendMessage(userId: number, message: string) {
    let wsMessage = new WSMessage(message, userId.toString());
    if (this.stompClient.connected) {
      this.stompClient.send("/app/chat/room/" + this.roomId, {'Access-Control-Allow-Origin': 'http://localhost:4200'}, JSON.stringify(wsMessage));
    }
  }

  disconnect() {
    this.stompClient.disconnect();
  }

/*  private socket: WebSocketSubject<WSMessage>;
  private config: WebSocketSubjectConfig<WSMessage>;

  private wsMessages: Subject<WSMessage>;

  private connection: Observer<boolean>;
  public status: Observable<boolean>;

  constructor() {
    this.status = new Observable<boolean>((observer) => {
      this.connection = observer;
    }).pipe(share(), distinctUntilChanged());

    this.config = {
      url: 'ws://localhost:8080/chat',
      closeObserver: {
        next: (event) => {
          this.connection.next(false);
        }
      },
      openObserver: {
        next: (event) => {
          console.log('Connected');
          this.connection.next(true);
        }
      }
    }

    this.connect();
  }

  private connect(): void {
    console.log('test');
    this.socket = new WebSocketSubject(this.config);
    this.socket.subscribe((message) => {this.wsMessages.next(message)})
  }

  public send(userId: number, message: string): void {
    const wsMessage = new WSMessage(message, userId.toString());
    this.socket.next(wsMessage);
  }*/
}
