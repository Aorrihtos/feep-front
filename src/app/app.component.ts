import { Component } from '@angular/core';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {far} from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fepp';

  constructor(library: FaIconLibrary) {
    library.addIconPacks(far);
  }
}
