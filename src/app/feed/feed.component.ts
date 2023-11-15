import {
  AfterContentInit, AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy, OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {UserService} from "../services/user.service";
import {PostService} from "../services/post.service";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {RankComponent} from "./rank/rank.component";
import {ProfileComponent} from "./profile/profile.component";
import {PostDetailComponent} from "./post-detail/post-detail.component";
import {catchError, forkJoin, of, Subscriber, Subscription} from "rxjs";
import {WebsocketsService} from "../services/websockets.service";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnDestroy{

  @ViewChild('postArea')
  postArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('postBtn')
  postBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  @ViewChild(RankComponent) rank!: RankComponent;

  @ViewChild(ProfileComponent) profileCard!: ProfileComponent;

  @ViewChild('postsDiv')
  postsDiv!: ElementRef<HTMLDivElement>;

  loggedId: string;
  image: string = '';
  posts: Array<any> = [];
  feed: Array<any> = [];
  activeArray: Array<any> = this.feed;
  id: string | null = null;
  viewing_post: boolean = false;
  paginationPosts: any;
  paginationFeed: any;
  postImage: File | null = null;
  isLoading: boolean = true;
  clientBlocked: boolean = false;
  blockedByMe: boolean = false;

  data: any;
  paramSubscriber!: Subscription;

  constructor(public userService: UserService,
              private postService: PostService,
              private aRouter: ActivatedRoute,
              private router: Router,
              private socketService: WebsocketsService) {
    this.loggedId = (JSON.parse(localStorage.getItem('user')!))._id;
    this.paramSubscriber = this.aRouter.queryParams.subscribe(res =>{

      if(res['id']){
        this.blockedByMe = this.userService.blocks.get(res['id']);
      }

      // Set FEED as selected if loading own profile
      if(!this.id && this.isLoading) {this.activeArray = this.feed}

      // Check if viewing post
      if(res['post']){
        this.viewing_post = true;
      } else this.viewing_post = false;

      // Check if user id has changed to show skeleton
      if(this.id != res['id'] || this.isLoading && !this.id){
        this.isLoading = true;
        this.clientBlocked = false;
        this.id = res['id'];
        localStorage.setItem("scrollPost", "0");
        localStorage.setItem("scrollFeed", "0");
        this.initialize();
      } else this.isLoading = false;

      if(!this.blockedByMe)
        this.restoreScrollPosition();
    });
  }

  ngOnDestroy() {
    this.paramSubscriber.unsubscribe();
  }

  restoreScrollPosition(){
    setTimeout(()=>{
      if(!this.viewing_post){
        // Set the last scroll position
        const scrollPost = Number(localStorage.getItem("scrollPost") || 0),
          scrollFeed = Number(localStorage.getItem("scrollFeed") || 0);

        if(this.activeArray == this.posts){
          this.postsDiv.nativeElement.scrollTop = scrollPost;
        } else this.postsDiv.nativeElement.scrollTop = scrollFeed;
      }
    }, 2)
  }

  changeFeed(){
    let currentPostScroll = String(this.postsDiv.nativeElement.scrollTop);
    localStorage.setItem('scrollPost', currentPostScroll);
    this.activeArray = this.feed;
    // We set timeout to not bug the scrollTop when changing Div length
    setTimeout(()=>{
      this.postsDiv.nativeElement.scrollTop = Number(localStorage.getItem('scrollFeed'));
    }, 2);
  }

  changePosts(){
    let currentFeedScroll = String(this.postsDiv.nativeElement.scrollTop);
    localStorage.setItem('scrollFeed', currentFeedScroll);
    this.activeArray = this.posts;
    // Set timeout to not bug the scrollTop when changing Div length
    setTimeout(()=>{
      this.postsDiv.nativeElement.scrollTop = Number(localStorage.getItem('scrollPost'));
    }, 2);
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
    );
  }

  unfollow(userId: string){
    this.userService.unfollow(userId);
    //this.activeArray = this.activeArray.filter(i => i.user_id._id !== userId);
  }

  block(userId: string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to see his posts and comments',
      showDenyButton: true,
      confirmButtonText: 'Block',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.block(userId)?.subscribe(()=>{
          this.rmPostBlockedUser(userId);
        });
      }
    })
  }

  rmPostBlockedUser(userId: string){
    if(this.activeArray === this.feed){
      this.isLoading = true;
      this.userService.feed()?.subscribe((res: any) => {
        this.feed = res.feed;
        this.paginationFeed = res.pagination;
        this.activeArray = this.feed;
        this.isLoading = false;
      })
    } else {
      this.posts = this.posts.filter(i => i.user_id._id !== userId);
      this.activeArray = this.posts;
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
    const indexPost = this.activeArray.findIndex(item => item._id === idPost);
    if(indexPost >= 0){
      //Data for post detail variables
      this.data = {
        idPost: idPost,
        loggedId: this.loggedId,
        idUser: this.activeArray[indexPost].user_id._id,
        content: this.activeArray[indexPost].content,
        attached_file: this.activeArray[indexPost].attached_file,
        imageUserPost: this.activeArray[indexPost].user_id.profile_pic,
        username: this.activeArray[indexPost].user_id.username,
        created_at: this.activeArray[indexPost].created_at,
        likes: this.activeArray[indexPost].likes,
        comments: this.activeArray[indexPost].comments
      };
    }

    // Save the current scroll position
    if(this.activeArray == this.posts){
      localStorage.setItem("scrollPost", String(this.postsDiv.nativeElement.scrollTop));
    } else{
      localStorage.setItem("scrollFeed", String(this.postsDiv.nativeElement.scrollTop));
    }

    // changes the route without moving from the current view
    this.router.navigate([], {
      relativeTo: this.aRouter,
      queryParams: {
        post: idPost
      },
      queryParamsHandling: 'merge'
    });

    this.viewing_post = true;
  }

  imageChangeEvent(url: any){
    this.image = url;
    this.rank.setImage(url);
  }

  like(post: any){
    this.postService.like(post)!.subscribe(res => {
      this.updatePostLikes(post._id, 'add')
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

  isLoadingNext: boolean = false;
  scrollBounce: boolean = true;
  loadNext(){
    setTimeout(()=>{
      if(!this.scrollBounce) return;
      this.scrollBounce = false;
      this.loadNextManagement();
      setTimeout(()=>{this.scrollBounce = true}, 500);
    }, 500);
  }

  loadNextManagement(){
    // Checking scroll percentage
    let height = this.postsDiv.nativeElement.clientHeight;
    let scrollHeight = this.postsDiv.nativeElement.scrollHeight - height;
    let scrollTop = this.postsDiv.nativeElement.scrollTop;
    let percent = Math.floor(scrollTop / scrollHeight * 100);
    if(percent >= 95){
      // Load next page
      if(this.activeArray === this.posts && this.paginationPosts.page < this.paginationPosts.total_pages){
        this.isLoadingNext = true;
        this.userService.posts(this.id, ++this.paginationPosts.page)?.subscribe(
          (res: any) => {
            this.posts = this.posts.concat(res.posts);
            this.activeArray = this.posts;
            this.paginationPosts = res.pagination;
            this.isLoadingNext = false;
          },
          err => console.log(err)
        );
      } else if (this.activeArray === this.feed && this.paginationFeed.page < this.paginationFeed.total_pages){
        this.isLoadingNext = true;
        this.userService.feed(++this.paginationFeed.page)?.subscribe(
          (res: any) => {
            this.feed = this.feed.concat(res.feed);
            this.activeArray = this.feed;
            this.paginationFeed = res.pagination;
            this.isLoadingNext = false;
          },
          (err: any) => console.log(err)
        );
      }
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

  reloadPosts(event: string){
    if(event==="block"){
      this.blockedByMe = true;
      this.activeArray = [];
    } else {
      this.isLoading = true;
      this.userService.posts(this.id)!.subscribe((res: any) =>{
        this.paginationPosts = res.pagination;
        this.posts = res.posts;
        this.activeArray = this.posts;
        this.isLoading = false;
      });
    }
  }

  initialize(){
    if(this.viewing_post) return;

    let promises = [
      this.userService.getProfilePic(this.id)!,
      this.userService.posts(this.id)!.pipe(catchError(e => of(e)))
    ];

    if(!this.id){
      promises.push(this.userService.feed()!);
    }

    forkJoin(promises).subscribe(([profilePic, postsData, feedData = null]: Array<any>) => {
      this.image = profilePic;

      if(postsData.status === 403){
        this.activeArray = [];
        if(postsData.error.message == "You have blocked this user")
          this.blockedByMe = true;
        else this.clientBlocked = true;
        this.isLoading = false;
        return;
      }
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
