import { Component } from '@angular/core';
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', './settings-profile.css']
})
export class SettingsComponent {

  active: string = 'profile';

  constructor(private router: Router) {
  }

  logout(){
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Log out',
      confirmButtonColor: "#EF443CFF"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigateByUrl("");
      }
    })
  }
}
