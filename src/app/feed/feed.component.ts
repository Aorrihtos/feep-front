import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {UserService} from "../services/user.service";
import {PostService} from "../services/post.service";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {RankComponent} from "./rank/rank.component";
import {ProfileComponent} from "./profile/profile.component";
import {PostDetailComponent} from "./post-detail/post-detail.component";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent{

  @ViewChild('postArea')
  postArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('postBtn')
  postBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  @ViewChild(RankComponent) rank!: RankComponent;

  @ViewChild(ProfileComponent) profileCard!: ProfileComponent;

  loggedId: string;
  image: string = '';
  posts: Array<any> = [];
  feed: Array<any> = [];
  activeArray: Array<any> = [];
  id: string | null = null;
  viewing_post: boolean = false;
  paginationPosts: any;
  paginationFeed: any;
  postImage: File | null = null;
  isLoading: boolean = true;

  data: any;

  constructor(public userService: UserService,
              private postService: PostService,
              private aRouter: ActivatedRoute,
              private router: Router) {
    this.loggedId = (JSON.parse(localStorage.getItem('user')!))._id;
    this.aRouter.queryParams.subscribe(res =>{
      this.isLoading = true;
      this.id = res['id'];
      if(!this.id) {this.activeArray = this.feed}
      this.initialize();
    });
  }

  post(){
    this.postBtn.nativeElement.disabled = true;
    const content = this.postArea.nativeElement.value;

    if(content.length > 500){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Post is too long. Maximum 500 characters.'
      });
      this.postArea.nativeElement.value = "";
      this.postBtn.nativeElement.disabled = false;
      return;
    }

    // Check if content is empty
    if((!content || content.trim() == "") && !this.postImage){
      this.postBtn.nativeElement.disabled = false;
      return;
    }

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
        this.postBtn.nativeElement.disabled=false;
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message
        });
        this.postBtn.nativeElement.disabled=false;
      }
    )
  }

  unfollow(userId: string){
    this.userService.unfollow(userId);
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
    const i = this.activeArray.findIndex(item => item._id === idPost);
    //Data for post detail variables
    this.data = {
      idPost: idPost,
      loggedId: this.loggedId,
      idUser: this.activeArray[i].user_id._id,
      content: this.activeArray[i].content,
      attached_file: this.activeArray[i].attached_file,
      imageUserPost: this.activeArray[i].user_id.profile_pic,
      username: this.activeArray[i].user_id.username,
      created_at: this.activeArray[i].created_at,
      likes: this.activeArray[i].likes,
      comments: this.activeArray[i].comments
    };
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
        this.paginationPosts.total_items--;
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

  commentEvent(comments: any){
    const index = this.activeArray.findIndex(post => post._id == comments.idPost);
    this.activeArray[index].comments = comments.value;
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
      this.userService.posts(this.id, ++this.paginationPosts.page)?.subscribe(
        (res: any) => {
          this.posts = this.posts.concat(res.posts);
          this.activeArray = this.posts;
          this.paginationPosts = res.pagination;
        },
        err => console.log(err)
      );
    } else if (this.activeArray === this.feed && this.paginationFeed.page < this.paginationFeed.total_pages){
        this.userService.feed(++this.paginationFeed.page)?.subscribe(
          (res: any) => {
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
    this.postImage = file || null;
    this.fileInput.nativeElement.value = "";
  }

  checkIsLiked(idPost: string){
    return this.postService.liked_posts.indexOf(idPost) >= 0;
  }

  initialize(){
    this.isLoading = true;

    let promises = [
      this.userService.getProfilePic(this.id)!,
      this.userService.posts(this.id)!
    ];

    if(!this.id){
      promises.push(this.userService.feed()!);
    }

    forkJoin(promises).subscribe(([profilePic, postsData, feedData = null]: Array<any>) => {
      this.image = profilePic;
      this.paginationPosts = postsData.pagination!;
      this.posts = postsData.posts;

      if(feedData){
        this.feed = feedData.feed;
        this.activeArray = this.feed;
        this.paginationFeed = feedData.pagination;
      }

      this.activeArray = this.id
        ? this.posts
        : this.feed;

      setTimeout(()=>{this.isLoading = false;}, 200)
    });
  }

  async visit(userId: string | null){
    if(userId === this.loggedId) return;
    await this.router.navigate(['/feed'], {queryParams: {id: userId}});
  }

  protected readonly localStorage = localStorage;
  protected readonly window = window;
  protected readonly console = console;
}
