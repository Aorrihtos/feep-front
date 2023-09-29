import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FollowsComponent} from "./follows.component";

const routes: Routes = [{
  path: "",
  component: FollowsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowsRoutingModule { }
