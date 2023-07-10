import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../services/user.service";
import {PostService} from "../services/post.service";
import Swal from "sweetalert2";

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

  image: string = '';
  posts: Array<any> = [];
  feed: Array<any> = [];
  activeArray: Array<any> = [];

  constructor(private userService: UserService, private postService: PostService) {
    userService.getProfilePic()!.subscribe(
      (res: any) =>{
        this.image = res;
      }
    );
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
    userService.posts()?.subscribe(
      (res: any) => {
        this.posts = res.posts;
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

  follow(userId: string){
    console.log(userId);
    console.log(this.fileInput.nativeElement.files!.item(0))
  }

  block(userId: string){
    console.log(userId);
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
}
