import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RankService} from "../../services/rank.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {FeedComponent} from "../feed.component";

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent{

  rank: Array<any> = [];
  isLoading: boolean = true;

  @Output()
  pageChanged: EventEmitter<null> = new EventEmitter<null>();

  setImage(value: string){
    const element = this.rank.find(item => item.user_id._id === JSON.parse(localStorage.getItem('user')!)._id)
    if(element){
      const index = this.rank.indexOf(element);
      this.rank[index].image_url = value;
    }
  }

  colorMap: Map<number, string> = new Map<number, string>([
    [1, "first"],
    [2, "second"],
    [3, "third"]
  ]);

  constructor(private rankService: RankService, private userService: UserService, private router: Router) {
    this.rankService.rank().subscribe( (res: any) => {
      this.rank = res.rank;
      setTimeout(()=>{
        this.isLoading = false;
      },500)
    });
  }

  visit(userId: string | null){
    if(userId === (JSON.parse(localStorage.getItem('user')!))._id){
      userId = null;
    }
    this.router.navigate(['/feed'], {queryParams: {id: userId}})
      .then(() => {
        this.pageChanged.emit(null);
      });
  }
}
