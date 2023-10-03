import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RankMobileComponent} from "./rank-mobile.component";

const routes: Routes = [{
  path: "",
  component: RankMobileComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RankMobileRoutingModule { }
