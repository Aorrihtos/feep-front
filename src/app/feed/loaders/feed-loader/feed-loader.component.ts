import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-feed-loader',
  templateUrl: './feed-loader.component.html',
  styleUrls: ['./feed-loader.component.css']
})
export class FeedLoaderComponent {

  @Input()
  count: string = "15";

  protected readonly parseInt = parseInt;
}
