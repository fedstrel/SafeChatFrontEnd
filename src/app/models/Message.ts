export interface Message {
  id: number;
  text: string;
  userId: number;
  roomId: number;
  files?: string[];
}
