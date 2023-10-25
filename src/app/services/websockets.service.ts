import {EventEmitter, Injectable, Output} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
/**
 * Extendemos la clase "Socket" a nuestra clase
 */
export class WebsocketsService extends Socket{

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

    this.ioSocket.on('message', (res: any) => {
      console.log(res)
      let options: any = {
        imageUrl: res.userProfilePic,
        title: res.title
      }
      let customCss: any = {
        image: 'circle-popup',
        popup: 'container-popup'
      }
      if(res.text != ""){
        options.footer = res.text;
        customCss.footer = 'text-popup'
      }
      //if(res.loggedId == this.loggedId) return;
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: customCss,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
          toast.addEventListener('click', ()=> window.location.href = res.link)
        }
      })

      Toast.fire(options);
    });
  }

  emitEvent = (event: string, payload: any) => {
    this.ioSocket.emit(event, {
      payload
    });
  }

}
