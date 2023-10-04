import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-bottombar',
  templateUrl: './bottombar.component.html',
  styleUrls: ['./bottombar.component.css']
})
export class BottombarComponent {

  @Output()
  homeAction: EventEmitter<null> = new EventEmitter<null>();

  constructor(private router: Router) {
  }

  navigateHome(){
    this.router.navigate(['/feed'], {queryParams: {id: null}})
      .then(() => {
        this.homeAction.emit(null);
      });
  }

}
