import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {UserService} from "../services/user.service";
import {PostService} from "../services/post.service";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {RankComponent} from "./rank/rank.component";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {

  @ViewChild('postArea')
  postArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  @ViewChild(RankComponent) rank!: RankComponent;

  image: string = '';
  posts: Array<any> = [];
  feed: Array<any> = [];
  activeArray: Array<any> = [];
  id: string | null = null;
  mine: boolean = true;

  constructor(public userService: UserService,
              private postService: PostService,
              private aRouter: ActivatedRoute) {
    aRouter.queryParams.subscribe(res =>{
      this.id = res['id'];
      if(this.id) this.mine = false;
    })
    userService.getProfilePic(this.id)!.subscribe(
      (res: any) =>{
        this.image = res;
      }
    );
    if(this.mine){
      userService.feed()?.subscribe(
        (res: any) => {
          const aux: Array<any> = res.feed;
          for(let item of aux){
            let index = aux.indexOf(item);
            let userId = item.user_id._id;
            this.userService.getProfilePic(userId)?.subscribe(res =>{
              aux[index].user_id.profile_pic = res;
            });
          }
          this.feed = aux;
          this.activeArray = this.feed;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    userService.posts(this.id)?.subscribe(
      (res: any) => {
        this.posts = res.posts;
        if(!this.mine){
          this.activeArray = this.posts;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  post(){
    const content = this.postArea.nativeElement.value;
    if(!content || content.trim() == "") return;
    const post = {content}
    this.postService.publish(post)?.subscribe(
      (res: any)=>{
        this.postArea.nativeElement.value = "";
        this.posts.unshift(this.createPost(res.json.post));
        if(res.json.reward){
          Swal.fire({
            icon: 'success',
            title: 'Congrats!',
            text: `Today you have earned ${res.json.reward} points!`
          })
        }
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Try again later'
        })
      }
    )
  }

  unfollow(userId: string){
    this.userService.unfollow(userId);
    console.log(this.activeArray);
    //this.activeArray = this.activeArray.filter(i => i.user_id._id !== userId);
  }

  block(userId: string){
    this.userService.block(userId);
    if(this.activeArray === this.feed){
      this.activeArray = this.activeArray.filter(i => i.user_id._id !== userId);
    }
  }

  createPost(data: any){
    return {
      _id: data._id,
      user_id: {
        _id: data.user_id,
        username: JSON.parse(localStorage.getItem("user")!).username,
        profile_pic: this.image,
      },
      content: data.content,
      attached_file: data.attached_file,
      created_at: data.created_at,
      likes: 0,
      comments: 0
    }
  }

  imageChangeEvent(url: any){
    this.image = url;
    this.rank.setImage(url);
  }
}
