import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowsRoutingModule } from './follows-routing.module';
import { FollowsComponent } from './follows.component';
import {FeedModule} from "../feed/feed.module";


@NgModule({
  declarations: [
    FollowsComponent
  ],
  imports: [
    CommonModule,
    FollowsRoutingModule,
    FeedModule
  ]
})
export class FollowsModule { }
