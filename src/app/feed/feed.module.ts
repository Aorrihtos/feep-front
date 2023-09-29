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
import { CommentsComponent } from './loaders/comments/comments.component';
import { FeedLoaderComponent } from './loaders/feed-loader/feed-loader.component';


@NgModule({
    declarations: [
        FeedComponent,
        NavbarComponent,
        ProfileComponent,
        RankComponent,
        PostDetailComponent,
        CommentsComponent,
        FeedLoaderComponent
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
