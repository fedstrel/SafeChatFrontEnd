import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Room} from "../../../models/Room";
import {User} from "../../../models/User";
import {NavigationMonitoringService} from "../../../services/event/navigation-monitoring.service";
import {UserService} from "../../../services/api/user.service";

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit{

  @Input() curRoom: Room;

  userIdList: number[];
  hintUserList: User[];

  constructor(private navigationMonitoringService: NavigationMonitoringService,
              private userService: UserService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.userIdList = [];
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
    if (this.userIdList.indexOf(user.id) < 0)
      this.userIdList.push(user.id);
    this.hintUserList.splice(this.hintUserList.indexOf(user), 1);
    this.changeDetectorRef.detectChanges();
  }

  deleteUserIdFromList(userId: number) {
    this.userIdList.splice(this.userIdList.indexOf(userId), 1);
    console.log(this.userIdList);
    this.changeDetectorRef.detectChanges();
  }

  confirmAddition() {
    this.navigationMonitoringService.confirmUserAddition(this.userIdList);
  }
}
