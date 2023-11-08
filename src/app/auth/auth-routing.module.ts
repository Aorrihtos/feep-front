import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth.component";
import {ConfirmationModule} from "./confirmation/confirmation.module";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent
  },
  {
    path: "confirmation/:token/:username",
    loadChildren: ()=> ConfirmationModule
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
