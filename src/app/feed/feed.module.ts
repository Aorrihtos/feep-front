import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { RankComponent } from './rank/rank.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";


@NgModule({
    declarations: [
        FeedComponent,
        NavbarComponent,
        ProfileComponent,
        RankComponent
    ],
    exports: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        FeedRoutingModule,
        NgxSkeletonLoaderModule
    ]
})
export class FeedModule { }
