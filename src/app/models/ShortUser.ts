import {User} from "./User";

export class ShortUser {
  id: number;
  firstname: string;
  lastname: string;

  constructor(_id: number, _firstname: string, _lastname: string) {
    this.id = _id;
    this.firstname = _firstname;
    this.lastname = _lastname;
  }

  static toShortUser(user: User): ShortUser {
    return new ShortUser(user.id, user.firstname, user.lastname);
  }
}
