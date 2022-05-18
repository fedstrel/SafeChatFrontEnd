import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Room} from "../../models/Room";
import {RoomService} from "../../services/api/room.service";
import {Router} from "@angular/router";
import {NavigationMonitoringService} from "../../services/event/navigation-monitoring.service";
import {TokenStorageService} from "../../services/global/token-storage.service";
import {DecodedToken} from "../../models/DecodedToken";
import jwtDecode from "jwt-decode";
import {WebsocketNotificationService} from "../../services/global/websocket-notification.service";

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.css']
})
export class RoomMenuComponent implements OnInit, OnDestroy {

  rooms!: Room[];
  searchRooms: Room[];
  decodedToken: DecodedToken;

  constructor(private tokenService: TokenStorageService,
              private roomService: RoomService,
              private wsService: WebsocketNotificationService,
              private navigationMonitoringService: NavigationMonitoringService,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit(): void {
    this.decodedToken = jwtDecode<DecodedToken>(this.tokenService.getUser());
    this.updateRooms();
    this.router.routeReuseStrategy.shouldReuseRoute = function () {return false;};
    this.wsService.connect(this.decodedToken);
    this.wsService.notificationReceivedEvent.subscribe(() => {
      this.updateRooms();
      this.changeDetectorRef.detectChanges();
    });

    this.navigationMonitoringService.roomListChangedEvent
      .subscribe(() => {
        this.updateRooms();
    });

    this.navigationMonitoringService.roomSearchListChangedEvent
      .subscribe((roomsInfo) => {
        this.updateSearchRooms(roomsInfo);
        this.changeDetectorRef.detectChanges();
      })
  }

  ngOnDestroy() {
    this.wsService.disconnect();
  }

  updateRooms(): void {
    this.roomService.getAllRoomsByUserId(this.decodedToken.id)
      .subscribe((data) => {
        console.log(data);
        this.rooms = data;
        this.changeDetectorRef.detectChanges();
      });
  }

  updateSearchRooms(roomsInfo: Room[]): void {
    this.searchRooms = roomsInfo.filter((room) => {
      return !this.roomInRooms(room);
    });
    this.searchRooms.forEach(elem => console.log(elem));
    this.changeDetectorRef.detectChanges();
  }

  roomInRooms(r1: Room): boolean {
    for (let room of this.rooms)
      if (r1.id == room.id)
        return true;
    return false;
  }

  navigateToRoom(roomId: number): void {
    this.router.navigate(['/room', roomId]);
  }

  navigateToRoomSettings(roomId: number): void {
    this.router.navigate(['/room-settings', roomId]);
  }

  addRoom(roomId: number): void {
    this.roomService.addUsersToRoom(roomId, [this.decodedToken.id]).subscribe(() => {
      this.searchRooms.splice(this.findRoomIndexById(this.searchRooms, roomId), 1);
      this.updateRooms();
      this.changeDetectorRef.detectChanges();
      this.router.navigate(['/room', roomId]);
    });
  }

  findRoomIndexById(rooms: Room[], roomId: number): number {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id == roomId)
        return i;
    }
    return -1;
  }
}
