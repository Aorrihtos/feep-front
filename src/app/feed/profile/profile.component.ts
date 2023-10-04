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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges{

  @ViewChild("descArea")
  descArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild("sumText")
  sumText!: ElementRef<HTMLInputElement>;

  @ViewChild("descBtn")
  descBtn!: ElementRef<HTMLButtonElement>;

  @Output('imageChange') emitter: EventEmitter<string> = new EventEmitter<string>();
  @Input('image')
  image: string = '';

  @Input()
  id: string | null = null;

  username: string = '';
  summary: string = '';
  description: string = '';
  views: number = 0;
  followers: number = 0;
  points: number = 0;

  isLoading: boolean = true;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.initialize();
  }

  keyCapEvent(){
    const summaryInput = this.sumText.nativeElement;
    summaryInput.addEventListener('keypress', event =>{
      if(event.code == "Enter")
        event.preventDefault();
    });
    summaryInput.addEventListener('paste', event =>{
        event.preventDefault();
    });
    summaryInput.addEventListener('change', event =>{
      if(summaryInput.textContent!.length > 20){
        summaryInput.textContent = summaryInput.textContent!.substring(0,20);
      }
    });
  }

  initialize(){
    this.userService.detail(this.id)?.subscribe(
      (res: any) => {
        console.log(res);
        this.setData(res.user);
        setTimeout(()=>{this.isLoading = false; this.keyCapEvent();}, 500);
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
  }

  setDescription(){
    this.userService.description({
      description: this.descArea.nativeElement.value,
      summary: this.sumText.nativeElement.value
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
    this.isLoading = true;
    this.initialize();
  }

}
