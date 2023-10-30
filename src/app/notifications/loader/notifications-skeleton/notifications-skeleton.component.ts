import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-notifications-skeleton',
  templateUrl: './notifications-skeleton.component.html',
  styleUrls: ['./notifications-skeleton.component.css']
})
export class NotificationsSkeletonComponent {

  @Input()
  counter: number = 15;
}
