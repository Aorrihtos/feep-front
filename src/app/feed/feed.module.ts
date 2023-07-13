import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { RankComponent } from './rank/rank.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {ImageCropperModule} from "ngx-image-cropper";
import { PostDetailComponent } from './post-detail/post-detail.component';


@NgModule({
    declarations: [
        FeedComponent,
        NavbarComponent,
        ProfileComponent,
        RankComponent,
        PostDetailComponent
    ],
    exports: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        FeedRoutingModule,
        NgxSkeletonLoaderModule,
        ImageCropperModule
    ]
})
export class FeedModule { }
