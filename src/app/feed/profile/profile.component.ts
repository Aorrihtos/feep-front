import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit{

  @ViewChild("descArea")
  descArea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild("sumText")
  sumText!: ElementRef<HTMLParagraphElement>;

  @ViewChild("descBtn")
  descBtn!: ElementRef<HTMLButtonElement>;

  username: string = '';
  summary: string = '';
  description: string = '';
  @Input()
  image: string = '';
  views: number = 0;
  followers: number = 0;
  points: number = 0;

  constructor(private userService: UserService) {
    userService.detail()?.subscribe(
      (res: any) => {
        console.log(res);
        this.setData(res.user);
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.sumText.nativeElement.addEventListener('keypress', event =>{
      if(event.code == "Enter" || this.sumText.nativeElement.textContent!.length >= 25)
        event.preventDefault();
    })
  }

  setData(user: any){
    this.username = user.data.username;
    this.summary = user.data.summary
      ? user.data.summary
      : 'Insert your summary!';
    this.description = user.data.description
      ? user.data.description
      : '';
    this.views = user.data.views;
    this.followers = user.follow_counter.followers;
    this.points = user.points;
  }

  setDescription(){
    this.userService.description({
      description: this.descArea.nativeElement.value,
      summary: this.sumText.nativeElement.textContent
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
}
