import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {UserService} from "../services/user.service";
import {PostService} from "../services/post.service";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {RankComponent} from "./rank/rank.component";
import {ProfileComponent} from "./profile/profile.component";

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

  @ViewChild(ProfileComponent) profileCard!: ProfileComponent;

  loggedId: string;
  image: string = '';
  banner: string = '';
  posts: Array<any> = [];
  feed: Array<any> = [];
  activeArray: Array<any> = [];
  id: string | null = null;
  mine: boolean = true;
  viewing_post: boolean = false;
  idPost: string = '';
  paginationPosts: any;
  paginationFeed: any;
  postImage: File | null = null;
  attached_file: string | null = null;

  constructor(public userService: UserService,
              private postService: PostService,
              private aRouter: ActivatedRoute) {
    this.loggedId = (JSON.parse(localStorage.getItem('user')!))._id;
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
          this.feed = this.loadImages(res.feed);
          this.activeArray = this.feed;
          this.paginationFeed = res.pagination;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    userService.posts(this.id)?.subscribe(
      (res: any) => {
        this.paginationPosts = res.pagination;
        this.posts = this.loadImages(res.posts);
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
    this.postService.publish(content, this.postImage)?.subscribe(
      (res: any)=>{
        this.postArea.nativeElement.value = "";
        this.posts.unshift(this.createPost(res.json.post));
        this.postImage = null;
        this.paginationPosts.total_items++;
        if(res.json.reward){
          this.profileCard.points = this.profileCard.points + res.json.reward;
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
    if(this.postImage){
      data.attached_file = window.URL.createObjectURL(this.postImage);
    }
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

  navigatePost(idPost: string){
    this.idPost = idPost;
    const i = this.activeArray.findIndex(item => item._id === idPost);
    this.attached_file = this.activeArray[i].attached_file;
    this.viewing_post = true;
  }

  imageChangeEvent(url: any){
    this.image = url;
    this.rank.setImage(url);
  }

  backEvent(value: boolean){
    this.viewing_post = value;
  }

  like(idPost: string){
    this.postService.like(idPost)?.subscribe(res => {
      this.updatePostLikes(idPost, 'add')
    });
  }

  unlike(idPost: string){
    this.postService.unlike(idPost)?.subscribe(res => {
      this.updatePostLikes(idPost, 'del')
    });
  }

  delete(idPost: string){
    Swal.fire({
      icon: "question",
      title: 'Are you sure?',
      text: 'This cannot be undone',
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletePostEvent(idPost);
      }
    })
  }

  deletePostEvent(idPost: string){
    this.postService.delete(idPost)?.subscribe(
      (res: any) => {
        const index = this.posts.findIndex(post => post._id === idPost);
        this.posts.splice(index, 1);
        this.activeArray = this.posts;
      }
    )
  }

  updatePostLikes(idPost: string, action: string){
    if(action === 'add'){
      this.postService.liked_posts.push(idPost);
      const aux: Array<any> = this.activeArray === this.feed ? this.feed : this.posts;
      const index = aux.findIndex(post => post._id === idPost);
      aux[index].likes++;
      this.activeArray = aux;
    } else if (action === 'del') {
      const i = this.postService.liked_posts.indexOf(idPost);
      this.postService.liked_posts.splice(i, 1);
      const aux: Array<any> = this.activeArray === this.feed ? this.feed : this.posts;
      const index = aux.findIndex(post => post._id === idPost);
      aux[index].likes--;
      this.activeArray = aux;
    }
  }

  loadNext(){
    if(this.activeArray === this.posts && this.paginationPosts.page < this.paginationPosts.total_pages){
      this.userService.posts(null, ++this.paginationPosts.page)?.subscribe(
        (res: any) => {
          res.posts = this.loadImages(res.posts);
          this.posts = this.posts.concat(res.posts);
          this.activeArray = this.posts;
          this.paginationPosts = res.pagination;
        },
        err => console.log(err)
      );
    } else if (this.activeArray === this.feed && this.paginationFeed.page < this.paginationFeed.total_pages){
        this.userService.feed(++this.paginationFeed.page)?.subscribe(
          (res: any) => {
            res.feed = this.loadImages(res.feed);
            this.feed = this.feed.concat(res.feed);
            this.activeArray = this.feed;
            this.paginationFeed = res.pagination;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  uploadImage(fileInput: any){
    const file: File = fileInput.files[0];
    this.postImage = file ? file : null;
    this.fileInput.nativeElement.value = "";
  }

  checkIsLiked(idPost: string){
    return this.postService.liked_posts.indexOf(idPost) >= 0;
  }
  loadImages(posts: Array<any>): Array<any>{
    const aux: Array<any> = posts;
    for(let item of aux){
      let index = aux.indexOf(item);
      let userId = item.user_id._id;
      this.userService.getProfilePic(userId)?.subscribe(res =>{
        aux[index].user_id.profile_pic = res;
      });
      if(item.attached_file){
        this.postService.getImage(item._id)?.subscribe(res =>{
          aux[index].attached_file = res;
        })
      }
    }
    return aux;
  }

  protected readonly localStorage = localStorage;
  protected readonly window = window;
}
