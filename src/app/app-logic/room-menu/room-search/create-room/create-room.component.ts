import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RoomService} from "../../../../services/api/room.service";
import {TokenStorageService} from "../../../../services/global/token-storage.service";
import {DecodedToken} from "../../../../models/DecodedToken";
import jwtDecode from "jwt-decode";
import {NavigationMonitoringService} from "../../../../services/event/navigation-monitoring.service";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  private decodedToken: DecodedToken;
  public roomForm: FormGroup;

  constructor(private router: Router,
              private navigationMonitoringService: NavigationMonitoringService,
              private tokenService: TokenStorageService,
              private formBuilder: FormBuilder,
              private roomService: RoomService) { }

  ngOnInit(): void {
    this.decodedToken = jwtDecode<DecodedToken>(this.tokenService.getUser());
    this.roomForm = this.createRoomForm();
  }

  createRoomForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      publicityType: [null, Validators.compose([Validators.required])],
      roomType: [null, Validators.compose([Validators.required])],
    })
  }

  submitDataToServer() {
    this.roomService.createRoom(this.decodedToken.id, {
      name: this.roomForm.value.name,
      roomType: this.roomForm.value.roomType,
      publicityType: this.roomForm.value.publicityType,
    }).subscribe((roomData) => {
      console.log(roomData);
      this.navigationMonitoringService.roomListChanged("room added");
      this.router.navigate(['/room', roomData.id]);
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
