import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Room} from "../../models/Room";
import {UserService} from "../../services/user.service";
import {RoomService} from "../../services/room.service";
import {User} from "../../models/User";
import {Router} from "@angular/router";
import {NavigationMonitoringService} from "../../services/navigation-monitoring.service";

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.css']
})
export class RoomMenuComponent implements OnInit {

  rooms!: Room[];
  searchRooms: Room[];
  curUser!: User;

  constructor(private userService: UserService,
              private roomService: RoomService,
              private navigationMonitoringService: NavigationMonitoringService,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe((data) => {
        console.log(data);
        this.curUser = data;
        this.updateRooms(this.curUser.id);
      });

    this.navigationMonitoringService.roomListChangedEvent
      .subscribe(() => {
        this.updateRooms(this.curUser.id);
    });

    this.navigationMonitoringService.roomSearchListChangedEvent
      .subscribe((roomsInfo) => {
        this.updateSearchRooms(roomsInfo);
        this.changeDetectorRef.detectChanges();
      })
  }

  updateRooms(userId: number): void {
    this.roomService.getAllRoomsByUserId(userId)
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
    this.roomService.addUsersToRoom(roomId, [this.curUser.id]);
    this.router.navigate(['/room', roomId]);
  }

}
