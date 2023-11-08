import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {

  constructor(private authService: AuthService, private aRouter: ActivatedRoute, private router: Router) {
    Swal.fire({
      title: "Validating email...",
      width: 600,
      padding: "3em",
      color: "#EF443C",
      backdrop: `rgba(239,68,60,0.4)`,
      showConfirmButton: false
    });

    this.aRouter.params.subscribe((params: any) => {
      if(params.token && params.username){
        this.authService.confirm(params.username, params.token).subscribe({
          next: (res: any) => {
            localStorage.setItem('user', JSON.stringify(res.userUpdated));
            localStorage.setItem('token', JSON.stringify(res.token));

            Swal.fire({
              icon: "success",
              title: 'Everything OK!',
              html: 'Thanks to validate your email. You will be redirected to your page in a moment',
              timer: 2000,
              timerProgressBar: true,
              width: 600,
              padding: "3em",
              color: "#EF443C",
              backdrop: `rgba(239,68,60,0.4)`,
              showConfirmButton: false
            }).then(() => {
              this.router.navigateByUrl("/feed")
            });
          },
          error: err => {
            Swal.fire({
              icon: "error",
              title: "Something went wrong...",
              text: "Please, try again later",
              width: 600,
              padding: "3em",
              color: "#EF443C",
              backdrop: `rgba(239,68,60,0.4)`,
              showConfirmButton: false
            });
          }
        })
      }
    })
  }
}
