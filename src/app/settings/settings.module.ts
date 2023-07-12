import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import {FeedModule} from "../feed/feed.module";
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import {ReactiveFormsModule} from "@angular/forms";
import { BlockedComponent } from './blocked/blocked.component';


@NgModule({
  declarations: [
    SettingsComponent,
    ProfileSettingsComponent,
    BlockedComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FeedModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
