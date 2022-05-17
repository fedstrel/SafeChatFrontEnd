import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoomService} from "../../../services/api/room.service";
import {NavigationMonitoringService} from "../../../services/event/navigation-monitoring.service";

@Component({
  selector: 'app-room-search',
  templateUrl: './room-search.component.html',
  styleUrls: ['./room-search.component.css']
})
export class RoomSearchComponent implements OnInit {

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

  checkKeyInput(event: KeyboardEvent, value: string) {
    if (value.length != 0 && event.code === "Enter")
      this.updateRoomList(value);
  }
}
