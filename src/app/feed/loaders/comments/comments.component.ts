import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-comments-loader',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {

  @Input()
  count: string = "15";

  protected readonly parseInt = parseInt;
}
