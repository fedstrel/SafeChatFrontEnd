import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {MaterialModule} from "./material-module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {authInterceptorProviders} from "./helper/auth-interceptor.service";
import { ProfileComponent } from './app-logic/profile/profile.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NavigationComponent } from './app-logic/navigation/navigation.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {autherrorInterceptorProviders} from "./helper/error-interceptor.service";
import { RoomMenuComponent } from './app-logic/room-menu/room-menu.component';
import { RoomComponent } from './app-logic/room/room.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    NavigationComponent,
    RoomMenuComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  providers: [
    authInterceptorProviders,
    autherrorInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
