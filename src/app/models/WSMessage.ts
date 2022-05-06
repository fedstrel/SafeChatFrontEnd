export class WSMessage {
  message: string;
  senderId: string;

  constructor(_message: string, _senderId: string) {
    this.message = _message;
    this.senderId = _senderId;
  }
}
