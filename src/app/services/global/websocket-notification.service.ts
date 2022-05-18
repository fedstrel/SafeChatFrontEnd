import {EventEmitter, Injectable, Output} from '@angular/core';
import {WSMessage} from "../../models/WSMessage";
import {CompatClient, Stomp, StompConfig} from "@stomp/stompjs";
import {DecodedToken} from "../../models/DecodedToken";
import * as SockJS from "sockjs-client";

const WS_ENDPOINT = "https://fathomless-ridge-03736.herokuapp.com";

@Injectable({
  providedIn: 'root'
})
export class WebsocketNotificationService {
  @Output() notificationReceivedEvent = new EventEmitter<WSMessage>();

  public stompClient: CompatClient;

  connect(token: DecodedToken){
    let config = new StompConfig();

    let socket = new SockJS(WS_ENDPOINT + '/chat');
    this.stompClient = Stomp.over(socket);
    this.stompClient.configure(config);
    this.stompClient.connect(token.username, token.password, () => {
      this.trySubscribing(token.id);
    });
  }

  trySubscribing(userId: number) {
    console.log("notification connected=" + this.stompClient.connected);
    this.stompClient.subscribe("/topic/notification/" + userId, response => {
      let data = JSON.parse(response.body);
      let message = new WSMessage(data.message, data.senderId);
      this.notificationReceivedEvent.emit(message);
    });
  }

  notifyAboutChange(userId: number) {
    if (this.stompClient.connected) {
      this.stompClient.send("/app/chat/user/" + userId);
    }
  }

  disconnect() {
    this.stompClient.disconnect();
  }
}
