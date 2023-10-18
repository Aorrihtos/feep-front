import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {CommentService} from "../../services/comment.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy{

  postId: string = "";

  @Input()
  data!: any;

  @ViewChild('commentArea')
  commentArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('postBtn')
  postBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('commentDiv')
  commentDiv!: ElementRef<HTMLDivElement>;

  imageLoggedUser!: string

  comments!: Array<any>;
  commentPagination: any;

  isLoading: boolean = true;
  isCommentLoading: boolean = true;
  isLiked?: boolean;
  isLoadingNext: boolean = false;

  paramSubscriber! : Subscription;

  @Output('liked_post')
  likeEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Output('unliked_post')
  unlikeEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Output('delete_post')
  delete_emitter: EventEmitter<string> = new EventEmitter<string>();

  @Output('comment_update')
  comment_emiter: EventEmitter<{idPost: string, value: number}> = new EventEmitter<{idPost: string, value: number}>();

  constructor(private postService: PostService,
              public userService: UserService,
              public commentService: CommentService,
              private aRouter: ActivatedRoute)
  {
    this.paramSubscriber = this.aRouter.queryParams.subscribe(params => {
      this.postId = params['post'];
    });
    this.imageLoggedUser = JSON.parse(localStorage.getItem("user")!).profile_pic;
    this.isLiked = this.checkIsLiked(this.postId);
  }

  ngOnInit(): void {
    /* Check if data was provided by the parent component.
    If it wasn't, call the API for the details.*/
    if(!this.data){
      this.isLoading = true;
      this.postService.detail(this.postId)?.subscribe(
        (res: any) => {
          this.comments = res.comments;
          this.data = {
            idPost: this.postId,
            loggedId: "",
            idUser: res.post.user_id._id,
            content: res.post.content,
            attached_file: res.post.attached_file,
            imageUserPost: res.post.user_id.profile_pic,
            username: res.post.user_id.username,
            created_at: res.post.created_at,
            likes: res.likes,
            comments: res.pagination.total_items
          };
          this.commentPagination = res.pagination;
          this.isLoading=false;
          this.isCommentLoading = false;
        }
      );
    } else {
      this.isLoading = false;
      this.postService.getComments(this.postId)?.subscribe((res: any) => {
        this.comments = res.comments;
        this.commentPagination = res.pagination;
        this.isCommentLoading = false;
      });
    }
  }

  ngOnDestroy() {
    this.paramSubscriber.unsubscribe();
  }

  likePost(){
    this.data.likes++;
    this.isLiked = true;
    this.likeEmitter.emit(this.data.idPost);
  }

  unlikePost(){
    this.data.likes--;
    this.isLiked = false;
    this.unlikeEmitter.emit(this.data.idPost);
  }

  postComment(){
    this.postBtn.nativeElement.disabled=true;
    const content = this.commentArea.nativeElement.value;

    if(content.length > 250){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Comment is to long, maximum 250 characters"
      });
      this.postBtn.nativeElement.disabled=false;
      return;
    }

    this.postService.sendComment(content, this.data.idPost)?.subscribe(
      (res: any) => {
        this.commentArea.nativeElement.value = '';
        res.comment.user_id.profile_pic = this.imageLoggedUser;
        res.comment.likes = 0;
        this.data.comments++;
        this.comments.unshift(res.comment);
        this.postBtn.nativeElement.disabled=false;
        this.comment_emiter.emit({idPost: this.data.idPost, value: this.data.comments});
      }
    )
  }

  delete(action: string, idComment: string | null = null){
    Swal.fire({
      icon: "question",
      title: 'Are you sure?',
      text: 'This cannot be undone',
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        if(action === 'post'){
          this.delete_emitter.emit(this.data.idPost);
          history.back();
        } else if (action === 'comment' && idComment !== null){
          this.postService.delComment(idComment)?.subscribe(
            (res: any) =>{
              const index = this.comments.findIndex(c => c._id === idComment);
              this.data.comments--;
              this.comments.splice(index, 1);
              this.comment_emiter.emit({idPost: this.data.idPost, value: this.data.comments});
            }
          )
        }
      }
    })
  }

  scrollDebounce: boolean = true;
  loadNext(){
    setTimeout(()=>{
      if(this.scrollDebounce){
        this.scrollDebounce = false;

        // Checking scroll percentage
        let height = this.commentDiv.nativeElement.clientHeight;
        let scrollHeight = this.commentDiv.nativeElement.scrollHeight - height;
        let scrollTop = this.commentDiv.nativeElement.scrollTop;
        let percent = Math.floor(scrollTop / scrollHeight * 100);

        if(percent >= 95) {
          // Load next page
          if (this.commentPagination.page < this.commentPagination.total_pages) {
            this.isLoadingNext = true;
            const newPage = ++this.commentPagination.page;
            this.postService.getComments(this.postId, newPage)!.subscribe((res: any) => {
              console.log(this.comments);
              this.commentPagination = res.pagination;
              this.commentDiv.nativeElement.scrollTop = scrollTop;
              this.comments = this.comments.concat(res.comments);
              this.isLoadingNext = false;
            });
          }
        }
        setTimeout(()=>{this.scrollDebounce = true}, 500);
      }
    }, 500);
  }

  checkIsLiked(idPost: string){
    return this.postService.liked_posts.indexOf(idPost) >= 0;
  }

  keyPressEvent(event: any){
    if(event.key === 'Enter'){
      event.preventDefault();
      this.postComment();
    }
  }

  protected readonly window = window;
  protected readonly history = history;
}
