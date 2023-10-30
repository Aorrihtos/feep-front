import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketsService} from "../../services/websockets.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-bottombar',
  templateUrl: './bottombar.component.html',
  styleUrls: ['./bottombar.component.css']
})
export class BottombarComponent implements OnDestroy{

  @Output()
  homeAction: EventEmitter<null> = new EventEmitter<null>();

  notifications: number = 0;
  subscription: Subscription;
  constructor(private router: Router, private socketService: WebsocketsService) {
    this.subscription = this.socketService.notifications_obs.subscribe(notifications => {
      this.notifications = notifications;
    })
  }

  navigateHome(){
    this.router.navigate(['/feed'], {queryParams: {id: null}})
      .then(() => {
        this.homeAction.emit(null);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
