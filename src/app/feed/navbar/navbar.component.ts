import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit{

  constructor(private router: Router) {
  }

  navigateHome(){
    this.router.navigateByUrl('/feed').then(
      () => window.location.reload()
    )
  }

  ngAfterViewInit(): void {
    let hamburguer = document.getElementById("hamburguer-icon")!;
    function hamburger_menu() {
      var x = document.getElementById("myTopnav")!;
      if (x.className === "nav-items-topBar") {
        x.className += " responsive";
      } else {
        x.className = "nav-items-topBar";
      }
    }
    hamburguer.addEventListener("click", hamburger_menu);
  }

}
