import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {ProfileComponent} from "./app-logic/profile/profile.component";
import {RoomComponent} from "./app-logic/room/room.component";
import {RoomSettingsComponent} from "./app-logic/room-settings/room-settings.component";
import {FofComponent} from "./fof/fof.component";
import {GreetingComponent} from "./greeting/greeting.component";
import {CreateRoomComponent} from "./app-logic/room-menu/room-search/create-room/create-room.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'room/:id', component: RoomComponent},
  {path: 'room-settings/:id', component: RoomSettingsComponent},
  {path: 'create-room', component: CreateRoomComponent},
  {path: '', component: GreetingComponent},
  {path: '**', component: FofComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
