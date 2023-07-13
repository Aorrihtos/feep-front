import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, AfterViewInit{

  @ViewChild('commentArea')
  commentArea!: ElementRef<HTMLTextAreaElement>;

  @Input()
  idPost!: string;

  imageLoggedUser!: string

  imageUserPost!: string;

  comments!: Array<any>;

  @Output('viewing_post')
  emitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  post: any;

  constructor(private postService: PostService, public userService: UserService) {
    this.userService.getProfilePic()?.subscribe(
      url => this.imageLoggedUser = url
    );
  }
  ngOnInit(): void {
    this.postService.detail(this.idPost)?.subscribe(
      (res: any) => {
        this.post = res;
        this.userService.getProfilePic(res.post.user_id._id)?.subscribe(
          url => this.imageUserPost = url
        );
        this.comments = res.comments;
        this.comments.forEach((comment, index) =>{
          this.userService.getProfilePic(comment.user_id._id)?.subscribe(
            url => this.comments[index].user_id.profile_pic = url
          );
        })

      }
    );
  }

  postComment(){
    const content = this.commentArea.nativeElement.value;
    this.postService.sendComment(content, this.idPost)?.subscribe(
      (res: any) => {
        this.commentArea.nativeElement.value = '';
        res.comment.user_id.profile_pic = this.imageLoggedUser;
        this.comments.unshift(res.comment);
      }
    )
  }

  back(){
    this.emitter.emit(false);
  }

  ngAfterViewInit(): void {
    this.commentArea.nativeElement.addEventListener('keypress', (event) => {
      if(event.key === 'Enter'){
        this.postComment()
      }
    })
  }
}
