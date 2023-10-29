import {EventEmitter, Injectable, Output} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import Swal from "sweetalert2";
import {Observable, of, Subject} from "rxjs";

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

  /**
   * En nuestro constructor injectamos el "CookieService" para luego hacer uso de sus metodos.
   */
  constructor(private cookieService: CookieService) {
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

    this.ioSocket.on('counter', (res: any) => {
      this.notifications_pendent = res;
      this.notifications_obs.next(this.notifications_pendent);
    });
    this.ioSocket.on('message', (res: any) => {
      this.notifications_obs.next(++this.notifications_pendent);
      //if(res.loggedId == this.loggedId) return;
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
