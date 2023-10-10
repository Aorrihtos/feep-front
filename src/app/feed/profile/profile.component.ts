import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges{

  @ViewChild("descArea")
  descArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild("sumText")
  sumText?: ElementRef<HTMLInputElement>;

  @ViewChild("descBtn")
  descBtn!: ElementRef<HTMLButtonElement>;

  @Output('imageChange') emitter: EventEmitter<string> = new EventEmitter<string>();

  id: string | null = null;

  username: string = '';
  summary: string = '';
  description: string = '';
  views: number = 0;
  followers: number = 0;
  points: number = 0;
  image: string = '';

  isLoading: boolean = true;

  constructor(public userService: UserService, private aRouter: ActivatedRoute) {
    this.aRouter.queryParams.subscribe(res =>{
      this.isLoading = true;
      this.id = res['id'];
      this.initialize();
    });
  }

  ngOnInit(): void {
    // this.initialize();
  }

  keyDownEvent(event: any){
    if(event.code == 'Enter') event.preventDefault();
  }


  initialize(){
    this.userService.detail(this.id)?.subscribe(
      (res: any) => {
        this.setData(res.user);
        setTimeout(()=>{this.isLoading = false;}, 200);
      },
      err => {
        console.log(err);
      }
    );
  }

  setData(user: any){
    this.username = user.data.username;
    this.summary = user.data.summary || "";
    this.description = user.data.description || "";
    this.views = user.data.views;
    this.followers = user.follow_counter.followers;
    this.points = user.points;
    this.image = user.data.profile_pic;
  }

  setDescription(){
    this.userService.description({
      description: this.descArea.nativeElement.value,
      summary: this.sumText!.nativeElement.value
    })?.subscribe(
      (res: any) => {
        this.description = res.user.description;
        Swal.fire({
          position: 'top-start',
          icon: 'success',
          title: 'Details changed!',
          showConfirmButton: false,
          timer: 1500
        })
      },
      err => {
        console.log(err);
      }
    )
  }

  follow(userId: string){
    this.userService.follow(userId);
  }

  unfollow(userId: string) {
    this.userService.unfollow(userId);
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
        this.userService.block(userId);
      }
    })
  }

  pardon(userId: string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be able to see his posts and comments again',
      showDenyButton: true,
      confirmButtonText: 'Unblock',
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userService.pardon(userId);
      }
    })
  }

  fileChangeEvent(imgInput: any){
    const file: File = imgInput.files[0];
    this.userService.uploadImg(file)?.subscribe({
      complete: ()=> {
        this.image = window.URL.createObjectURL(file);
        this.emitter.emit(this.image);
      },
      error: (err)=> {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message
        })
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.isLoading = true;
    // this.initialize();
  }

}
