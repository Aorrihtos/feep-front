import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {CommentService} from "../../services/comment.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit{

  @Input()
  isLiked!: boolean;

  @Input()
  data: any;

  @ViewChild('commentArea')
  commentArea!: ElementRef<HTMLTextAreaElement>;

  imageLoggedUser!: string

  comments!: Array<any>;

  isLoading: boolean = true;

  @Output('viewing_post')
  emitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output('liked_post')
  likeEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Output('unliked_post')
  unlikeEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Output('delete_post')
  delete_emitter: EventEmitter<string> = new EventEmitter<string>();

  post: any;

  constructor(private postService: PostService, public userService: UserService, public commentService: CommentService) {
    this.userService.getProfilePic()?.subscribe(
      url => this.imageLoggedUser = url.toString()
    );
  }

  ngOnInit(): void {
    this.postService.detail(this.data.idPost)?.subscribe(
      (res: any) => {
        this.post = res;
        this.comments = res.comments;
        this.comments.forEach((comment, index) =>{
          this.userService.getProfilePic(comment.user_id._id)?.subscribe(
            url => this.comments[index].user_id.profile_pic = url
          );
        });
        setTimeout(()=>{this.isLoading=false}, 200)
      }
    );

  }

  likePost(){
    this.data.likes++;
    this.likeEmitter.emit(this.data.idPost);
  }

  unlikePost(){
    this.data.likes--;
    this.unlikeEmitter.emit(this.data.idPost);
  }

  postComment(){
    const content = this.commentArea.nativeElement.value;
    this.postService.sendComment(content, this.data.idPost)?.subscribe(
      (res: any) => {
        this.commentArea.nativeElement.value = '';
        res.comment.user_id.profile_pic = this.imageLoggedUser;
        res.comment.likes = 0;
        this.data.comments++;
        this.comments.unshift(res.comment);
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
          this.back();
        } else if (action === 'comment' && idComment !== null){
          this.postService.delComment(idComment)?.subscribe(
            (res: any) =>{
              const index = this.comments.findIndex(c => c._id === idComment);
              this.data.comments--;
              this.comments.splice(index, 1);
            }
          )
        }
      }
    })
  }

  back(){
    this.emitter.emit(false);
  }

  keyPressEvent(event: any){
    if(event.key === 'Enter'){
      event.preventDefault();
      this.postComment();
    }
  }

}
