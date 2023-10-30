import {Component, ElementRef, ViewChild} from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {WebsocketsService} from "../services/websockets.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  @ViewChild('notificationsDiv')
  notificationsDiv!: ElementRef<HTMLDivElement>;

  notifications?: Array<any>;
  pagination?: any;

  isLoading: boolean  = true;
  isLoadingNext: boolean = false;
  constructor(private notificationService: NotificationService,
              private socketService: WebsocketsService) {
    notificationService.getNotifications()?.subscribe((res: any) => {
      this.notifications = res.notifications;
      this.pagination = res.pagination;
      this.isLoading = false;
    });
    notificationService.markAsReaded();
    socketService.resetNotifications();
  }

  navigate(url: string){
    window.location.href=url;
  }

  scrollBounce: boolean = true;
  loadNext(){
    setTimeout(()=>{
      if(!this.scrollBounce) return;
      this.scrollBounce = false;
      this.loadNextManagement();
      setTimeout(()=>{this.scrollBounce = true}, 500);
    }, 500);
  }

  loadNextManagement(){
    // Checking scroll percentage
    let height = this.notificationsDiv.nativeElement.clientHeight;
    let scrollHeight = this.notificationsDiv.nativeElement.scrollHeight - height;
    let scrollTop = this.notificationsDiv.nativeElement.scrollTop;
    let percent = Math.floor(scrollTop / scrollHeight * 100);

    if(percent >= 95){
      // Load next page
      if(this.pagination.page < this.pagination.total_pages) {
        this.isLoadingNext = true;
        this.notificationService.getNotifications(++this.pagination.page)?.subscribe(
          (res: any) => {
            this.notifications = this.notifications?.concat(res.notifications);
            this.pagination = res.pagination;
            this.isLoadingNext = false;
          },
          err => console.log(err)
        );
      }
    }
  }

}
