import { Component } from '@angular/core';
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  active: string = 'profile';

  constructor(private userService: UserService, private router: Router) {
  }

  logout(){
    Swal.fire({
      icon: "warning",
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Log out',
      confirmButtonColor: "#EF443CFF"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigateByUrl("").then(()=> window.location.reload());
      }
    })
  }

  deleteAccount(){
    Swal.fire({
      icon: "warning",
      title: 'Are you sure?',
      text: 'This cannot be undone and all your data will be erased, like if you never had an account on this platform',
      showCancelButton: true,
      confirmButtonText: 'Delete account',
      confirmButtonColor: "#EF443CFF"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteAccount()?.subscribe(()=>{
          localStorage.clear();
          this.router.navigateByUrl("").then(()=> window.location.reload());
        });
      }
    })
  }
}
