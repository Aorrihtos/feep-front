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
    path: "follows",
    loadChildren: ()=> import('./follows/follows.module').then(m => m.FollowsModule),
    canMatch: [authGuard]
  },
  {
    path: "settings",
    loadChildren: ()=> import('./settings/settings.module').then(m => m.SettingsModule),
    canMatch: [authGuard]
  },
  {
    path: "search",
    loadChildren: ()=> import('./search/search.module').then(m => m.SearchModule),
    canMatch: [authGuard]
  },
  {
    path: "rank",
    loadChildren: ()=> import('./rank-mobile/rank-mobile.module').then(m => m.RankMobileModule),
    canMatch: [authGuard]
  },
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
