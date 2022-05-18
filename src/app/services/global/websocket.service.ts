import {EventEmitter, Injectable, Output} from '@angular/core';
import {WSMessage} from "../../models/WSMessage";
import * as SockJS from "sockjs-client";
import {CompatClient, Stomp, StompConfig, StompSubscription} from "@stomp/stompjs";
import {DecodedToken} from "../../models/DecodedToken";

const WS_ENDPOINT = 'https://fathomless-ridge-03736.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  @Output() messageReceivedEvent = new EventEmitter<WSMessage>();

  public stompClient: CompatClient;
  private roomId: number;
  private stompSub: StompSubscription;

  connect(roomId: number, token: DecodedToken) {
    this.roomId = roomId;
    let config = new StompConfig();

    let socket = new SockJS(WS_ENDPOINT + '/chat');
    this.stompClient = Stomp.over(socket);
    this.stompClient.configure(config);
    this.stompClient.connect(token.username, token.password, () => {
      this.trySubscribing(roomId);
    });
  }

  trySubscribing(roomId: number) {
    this.stompSub = this.stompClient.subscribe("/topic/messages/" + roomId, response => {
      let data = JSON.parse(response.body);
      let message = new WSMessage(data.message, data.senderId);
      this.messageReceivedEvent.emit(message);
    });
    console.log(this.stompClient.connected);
  }

  sendMessage(userId: number, message: string) {
    let wsMessage = new WSMessage(message, userId.toString());
    if (this.stompClient.connected) {
      this.stompClient.send("/app/chat/room/" + this.roomId, {}, JSON.stringify(wsMessage));
    }
  }

  disconnect() {
    this.stompSub.unsubscribe();
    this.stompClient.disconnect();
  }
}
