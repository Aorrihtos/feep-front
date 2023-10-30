import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import {FeedModule} from "../feed/feed.module";
import { NotificationsSkeletonComponent } from './loader/notifications-skeleton/notifications-skeleton.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";


@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationsSkeletonComponent
  ],
    imports: [
        CommonModule,
        NotificationsRoutingModule,
        FeedModule,
        NgxSkeletonLoaderModule
    ]
})
export class NotificationsModule { }
