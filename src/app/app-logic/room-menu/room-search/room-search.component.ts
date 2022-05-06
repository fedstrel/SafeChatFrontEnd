import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoomService} from "../../../services/room.service";
import {NavigationMonitoringService} from "../../../services/navigation-monitoring.service";
import {User} from "../../../models/User";

@Component({
  selector: 'app-room-search',
  templateUrl: './room-search.component.html',
  styleUrls: ['./room-search.component.css']
})
export class RoomSearchComponent implements OnInit {

  @Input() curUser: User;
  searchEmpty: boolean = false;

  constructor(private router: Router,
              private navigationMonitoringService: NavigationMonitoringService,
              private roomService: RoomService) { }

  ngOnInit(): void {
  }

  changeEmpty(value: string): void {
    if (value.length == 0) {
      this.navigationMonitoringService.roomListChanged("show user's rooms");
      this.navigationMonitoringService.roomSearchListChanged([]);
      this.searchEmpty = false;
      return;
    }
    this.searchEmpty = true;
  }

  navigateToCreateRoom(): void {
    this.router.navigate(['/create-room']);
  }

  updateRoomList(title: string): void {
    this.roomService.getAllRoomsContainingName(title).subscribe((roomsInfo) => {
      this.navigationMonitoringService.roomSearchListChanged(roomsInfo);
    });
    console.log(title);
  }
}
