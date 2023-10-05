import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit{

  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) {
  }

  async navigateHome(){
    await this.router.navigateByUrl('/feed');
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.addEventListener('keypress', event => {
      if(event.key === 'Enter'){
        const content = this.searchInput.nativeElement.value;
        this.router.navigate(["/search"],
          {queryParams: {user: content}}
        );
      }
    })
  }

}
