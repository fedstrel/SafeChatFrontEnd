import {User} from "./User";

export interface Message {
  id: number;
  text: string;
  user: User;
  roomId: number;
  files?: string[];
}
