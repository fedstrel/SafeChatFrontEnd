import jwtDecode from 'jwt-decode';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Room} from "../../models/Room";
import {RoomService} from "../../services/api/room.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TokenStorageService} from "../../services/global/token-storage.service";
import {DecodedToken} from "../../models/DecodedToken";
import {NavigationMonitoringService} from "../../services/event/navigation-monitoring.service";
import {WebsocketNotificationService} from "../../services/global/websocket-notification.service";
import {UserService} from "../../services/api/user.service";

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.css']
})
export class RoomSettingsComponent implements OnInit, OnDestroy {

  private routeSub!: Subscription;
  private addSub!: Subscription;
  private decodedToken!: DecodedToken;

  userButtonName: string = "Add users";
  roomLoaded: Promise<boolean>;
  admin!: boolean;
  showAddUsers: boolean = false;
  room!: Room;

  constructor(private roomService: RoomService,
              private userService: UserService,
              private navigationMonitoringService: NavigationMonitoringService,
              private wsService: WebsocketNotificationService,
              private tokenService: TokenStorageService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.getRoom(params['id']);

      this.subscribeToAdditionEvent(params['id']);
    });

  }

  ngOnDestroy() {
    console.log("destroy settings started");
    this.routeSub.unsubscribe();
    this.addSub.unsubscribe();
    this.wsService.disconnect();
    console.log("destroy settings ended");
  }

  getRoom(roomId: number) {
    this.roomService.getRoomById(roomId).subscribe(roomData => {
      this.room = roomData;
      this.setAdmin();
      this.wsService.connect(this.decodedToken);
      this.roomLoaded = Promise.resolve(true);
    });
  }

  subscribeToAdditionEvent(roomId: number) {
    this.addSub = this.navigationMonitoringService.confirmUserAdditionEvent.subscribe((userInfo) => {
      this.roomService.addUsersToRoom(roomId, userInfo).subscribe(() => {
        for (let userId of userInfo)
          this.wsService.notifyAboutChange(userId);
        console.log('addition completed');
      });
      this.showAddUsers = false;
      this.userButtonName = "Add users";
    });
  }

  setAdmin(): void {
    this.decodedToken = jwtDecode<DecodedToken>(this.tokenService.getUser());
    this.roomService.getIfUserIsAdminOfTheRoom(this.decodedToken.id, this.room.id).subscribe(res => {
      this.admin = res;
    });
  }

  addUsers() {
    if (this.showAddUsers) {
      this.showAddUsers = false;
      this.userButtonName = "Add users";
      return;
    }
    this.userButtonName = "Cancel";
    this.showAddUsers = true;
  }

  deleteRoom() {
    this.userService.getAllUsersByRoomId(this.room.id).subscribe(users => {
      this.roomService.deleteRoom(this.room.id, this.decodedToken.id).subscribe(() => {
        for (let user of users) {
          console.log("notify user " + user.id);
          this.wsService.notifyAboutChange(user.id);
        }
        this.navigationMonitoringService.roomListChanged("room deleted");
        this.router.navigate(['/profile']);
      });
    });
  }

  leaveRoom() {
    this.roomService.leaveRoom(this.room.id).subscribe(data => {
      console.log(data);
      this.navigationMonitoringService.roomListChanged("room left");
      this.router.navigate(['/profile']);
    });
  }

  extractNameFromType(type: string): string {
    return type.substring(type.lastIndexOf('_') + 1).toLocaleLowerCase();
  }
}
