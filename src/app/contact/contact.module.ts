import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import {FeedModule} from "../feed/feed.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ContactComponent
  ],
    imports: [
        CommonModule,
        ContactRoutingModule,
        FeedModule,
        ReactiveFormsModule
    ]
})
export class ContactModule { }
