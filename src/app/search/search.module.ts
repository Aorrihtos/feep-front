import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import {FeedModule} from "../feed/feed.module";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import { SearchLoaderComponent } from './loader/search-loader/search-loader.component';


@NgModule({
  declarations: [
    SearchComponent,
    SearchLoaderComponent
  ],
    imports: [
        CommonModule,
        SearchRoutingModule,
        FeedModule,
        NgxSkeletonLoaderModule
    ]
})
export class SearchModule { }
