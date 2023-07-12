import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {authGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: "feed",
    loadChildren: ()=> import('./feed/feed.module').then(m => m.FeedModule),
    canMatch: [authGuard]
  },
  {
    path: "contact",
    loadChildren: ()=> import('./contact/contact.module').then(m => m.ContactModule),
    canMatch: [authGuard]
  },
  {
    path: "settings",
    loadChildren: ()=> import('./settings/settings.module').then(m => m.SettingsModule),
    canMatch: [authGuard]
  }
  // {
  //   path: "**",
  //   redirectTo: ""
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
