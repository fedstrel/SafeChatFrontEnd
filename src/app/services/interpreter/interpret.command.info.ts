export class InterpretCommandInfo {
  public static info: string[] = [
    "help is used to show info about the available commands",
    "room_users [roomId] is used to show users that are present in the room",
    "delete_users [userId {, userId}] is used to delete users according to the listed ids (only if you are an administrator of the room)",
  ];
}
