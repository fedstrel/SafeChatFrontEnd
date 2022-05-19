import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoomService} from "../../../services/api/room.service";
import {NavigationMonitoringService} from "../../../services/event/navigation-monitoring.service";
import {DecodedToken} from "../../../models/DecodedToken";

@Component({
  selector: 'app-room-search',
  templateUrl: './room-search.component.html',
  styleUrls: ['./room-search.component.css']
})
export class RoomSearchComponent implements OnInit {

  @Input() token: DecodedToken;
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
    if (title.length == 0) {
      this.roomService.getPublicRoomsThatAreNotVisited(this.token.id).subscribe((roomsInfo) => {
        this.navigationMonitoringService.roomSearchListChanged(roomsInfo);
      });
      return;
    }

    this.roomService.getAllRoomsContainingName(title).subscribe((roomsInfo) => {
      this.navigationMonitoringService.roomSearchListChanged(roomsInfo);
    });
    console.log(title);
  }

  checkKeyInput(event: KeyboardEvent, value: string) {
    console.log(event.code)
    if (event.code === "Backspace" && value.length == 0)
      this.navigationMonitoringService.roomSearchListChanged([]);
    if (event.code === "Enter")
      this.updateRoomList(value);
  }
}
