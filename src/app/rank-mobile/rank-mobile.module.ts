import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RankMobileRoutingModule } from './rank-mobile-routing.module';
import { RankMobileComponent } from './rank-mobile.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {FeedModule} from "../feed/feed.module";


@NgModule({
  declarations: [
    RankMobileComponent
  ],
  imports: [
    CommonModule,
    RankMobileRoutingModule,
    NgxSkeletonLoaderModule,
    FeedModule
  ]
})
export class RankMobileModule { }
