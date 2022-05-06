import jwtDecode from 'jwt-decode';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Room} from "../../models/Room";
import {RoomService} from "../../services/room.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TokenStorageService} from "../../services/token-storage.service";
import {DecodedToken} from "../../models/DecodedToken";
import {NavigationMonitoringService} from "../../services/navigation-monitoring.service";

@Component({
  selector: 'app-room-settings',
  templateUrl: './room-settings.component.html',
  styleUrls: ['./room-settings.component.css']
})
export class RoomSettingsComponent implements OnInit, OnDestroy {

  private routeSub!: Subscription;
  private decodedToken!: DecodedToken;

  userButtonName: string = "Add users";
  roomLoaded: Promise<boolean>;
  admin!: boolean;
  showAddUsers: boolean = false;
  room!: Room;

  constructor(private roomService: RoomService,
              private navigationMonitoringService: NavigationMonitoringService,
              private tokenService: TokenStorageService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.roomService.getRoomById(params['id']).subscribe(roomData => {
        this.room = roomData;
        this.setAdmin();
        this.roomLoaded = Promise.resolve(true);
      });

      this.navigationMonitoringService.confirmUserAdditionEvent.subscribe((userInfo) => {
        this.roomService.addUsersToRoom(params['id'], userInfo).subscribe(() => {
          console.log('addition completed');
        });
        this.showAddUsers = false;
      });
    });

  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
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
    this.roomService.deleteRoom(this.room.id, this.decodedToken.id)
      .subscribe(data => {
        console.log(data);
        this.navigationMonitoringService.roomListChanged("room deleted");
        this.router.navigate(['/profile']);
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
