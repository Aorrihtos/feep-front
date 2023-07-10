import {Component, OnInit} from '@angular/core';
import {RankService} from "../../services/rank.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent{

  rank: Array<any> = [];
  isLoading: boolean = true;
  colorMap: Map<number, string> = new Map<number, string>([
    [1, "first"],
    [2, "second"],
    [3, "third"]
  ]);

  constructor(private rankService: RankService, private userService: UserService) {
    this.rankService.rank().subscribe( (res: any) => {
      const aux: Array<any> = res.rank;
      for (let item of aux){
        let index = aux.indexOf(item);
        this.userService.getProfilePic(item.user_id._id.toString())?.subscribe(
          (res: any) => {
            aux[index].image_url = res;
          }
        )
      }
      this.rank = aux;
      setTimeout(()=>{
        this.isLoading = false;
      },500)
      console.log(this.rank);
    });
  }

}
