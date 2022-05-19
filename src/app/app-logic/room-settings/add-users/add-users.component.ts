import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Room} from "../../../models/Room";
import {User} from "../../../models/User";
import {NavigationMonitoringService} from "../../../services/event/navigation-monitoring.service";
import {UserService} from "../../../services/api/user.service";
import {ShortUser} from "../../../models/ShortUser";

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit{

  @Input() curRoom: Room;

  userForAdditionList: ShortUser[];
  hintUserList: User[];

  constructor(private navigationMonitoringService: NavigationMonitoringService,
              private userService: UserService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.userForAdditionList = [];
  }

  showHintByName(username: string) {
    console.log(username);
    this.userService.getAllUsersContainingNameAndNotInTheRoom(this.curRoom.id, username)
      .subscribe((userData) => {
        console.log(userData);
        this.hintUserList = userData;
        this.changeDetectorRef.detectChanges();
      })
  }

  addUserIdToList(user: User) {
    if (this.userForAdditionList.indexOf(ShortUser.toShortUser(user)) < 0)
      this.userForAdditionList.push(ShortUser.toShortUser(user));
    this.hintUserList.splice(this.hintUserList.indexOf(user), 1);
    this.changeDetectorRef.detectChanges();
  }

  deleteUserIdFromList(user: ShortUser) {
    this.userForAdditionList.splice(this.userForAdditionList.indexOf(user), 1);
    console.log(this.userForAdditionList);
    this.changeDetectorRef.detectChanges();
  }

  confirmAddition() {
    this.navigationMonitoringService.confirmUserAddition(this.userForAdditionList.map
      (shortUser => {
        return shortUser.id;
      }));
  }
}
