export class ShortMessage {
  senderId: number;
  senderName: string;
  text: string;

  constructor(_senderId: number, _senderName: string, _text: string) {
    this.senderId = _senderId;
    this.senderName = _senderName;
    this.text = _text;
  }
}
