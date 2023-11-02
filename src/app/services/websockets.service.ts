import {EventEmitter, Injectable, Output} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import Swal from "sweetalert2";
import {Observable, of, Subject} from "rxjs";
import {NotificationService} from "./notification.service";
import {SwPush} from "@angular/service-worker";
import {NewsletterService} from "./newsletter.service";

@Injectable({
  providedIn: 'root'
})
/**
 * Extendemos la clase "Socket" a nuestra clase
 */
export class WebsocketsService extends Socket{

  notifications_pendent: number = 0;
  public notifications_obs = new Subject<number>();

  public resetNotifications(){
    this.notifications_pendent = 0;
    this.notifications_obs.next(this.notifications_pendent);
  }

  /**
   * Declaramos un metodo de emitir el cual llamaremos "outEven"
   */
  @Output() outEven: EventEmitter<any> = new EventEmitter<any>();

  loggedId: string = JSON.parse(localStorage.getItem('user')!)._id;

  readonly VAPID_PUBLIC_KEY = "BILqlwCR-fWjGbN4WiCclOhsziMEtQdTg6nWThvetzIVcdsiP83dfrfQUPTT4X3OcHCsUOj66Ze8PLzEZ3j0B4k";

  /**
   * En nuestro constructor injectamos el "CookieService" para luego hacer uso de sus metodos.
   */
  constructor(private notificationService: NotificationService,
              private swPush: SwPush,
              private newsletterService: NewsletterService) {
    /**
     * En nuestro "super" declaramos la configuración inicial de conexión la cual hemos declarado en nuestro
     * "environment.serverSocket",
     * tambien vemos como pasamos el "payload" dentro de options y "query"
     */
    super({
      url: environment.serverSocket,
      options: {
        query: {
          payload: localStorage.getItem("user")
        }
      }
    });

    // Asks to allow push notifications
    this.ioSocket.on('allow', (subs: Array<any>) =>{
      console.log(subs);
      swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
        .then(sub => {
          const newSub = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
              p256dh: sub.toJSON().keys!["p256dh"],
              auth: sub.toJSON().keys!["auth"]
            }
          }
          // Check if sub is already stored
          const index = subs.findIndex(s => s.endpoint == newSub.endpoint && s.expirationTime == newSub.expirationTime && s.keys.auth == newSub.keys.auth);
          if(index < 0){
            this.newsletterService.addSubscription(sub);
          }
        })
        .catch(err => console.log("Notifications not allowed"))
    });

    // Get number of pendent notifications
    this.ioSocket.on('counter', (res: any) => {
      console.log(res);
      this.notifications_pendent = res;
      this.notifications_obs.next(this.notifications_pendent);
    });

    // Displays notification alert in real-time
    this.ioSocket.on('message', (res: any) => {
      if(res.loggedId == this.loggedId) return;
      this.notifications_obs.next(++this.notifications_pendent);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          image: 'circle-popup',
          popup: 'container-popup',
          footer: 'text-popup'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
          toast.addEventListener('click', ()=> {
            this.notifications_obs.next(--this.notifications_pendent);
            this.notificationService.markAsReaded(res._id);
            window.location.href = res.link;
          });
        }
      })

      Toast.fire({
        imageUrl: res.userProfilePic,
        title: res.title,
        footer: res.text
      });
    });
  }

  emitEvent = (event: string, payload: any) => {
    this.ioSocket.emit(event, {
      payload
    });
  }

}
