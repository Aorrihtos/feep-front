import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // let hamburguer = document.getElementById("hamburguer-icon");
  //
  // function hamburger_menu() {
  //   var x = document.getElementById("myTopnav");
  //   if (x.className === "nav-items-topBar") {
  //     x.className += " responsive";
  //   } else {
  //     x.className = "nav-items-topBar";
  //   }
  // }

  @ViewChild("hamburguerIcon")
  hamburguer!: ElementRef<HTMLLinkElement>;

  @ViewChild("myTopnav")
  navbar!: ElementRef<HTMLDivElement>;

  hamburguer_menu(){
    console.log(this.navbar.nativeElement.className)
    if(this.navbar.nativeElement.className === "nav-items-topBar"){
      this.navbar.nativeElement.className += " responsive";
    } else {
      this.navbar.nativeElement.className = "nav-items-topBar";
    }
  }

}
