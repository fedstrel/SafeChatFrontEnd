import { Component, OnInit } from '@angular/core';
import {Room} from "../../models/Room";
import {UserService} from "../../services/user.service";
import {RoomService} from "../../services/room.service";
import {User} from "../../models/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.css']
})
export class RoomMenuComponent implements OnInit {

  rooms!: Room[];
  curUser!: User;

  constructor(private userService: UserService,
              private roomService: RoomService,
              private router: Router) { }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe((data) => {
        console.log(data);
        this.curUser = data;

        this.roomService.getAllRoomsByUserId(this.curUser.id)
          .subscribe((data) => {
            this.rooms = data;
            this.rooms.forEach(elem => console.log(elem));
          });
      });
  }

  navigateToRoom(roomId: number): void {
    this.router.navigate(['/room', roomId]);
    window.location.reload();
  }
}
