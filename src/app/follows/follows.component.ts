import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-follows',
  templateUrl: './follows.component.html',
  styleUrls: ['./follows.component.css']
})
export class FollowsComponent implements OnInit{

  following: Array<any> = [];
  followers: Array<any> = [];
  activeArray: Array<any> = this.following;
  constructor(public userService: UserService) {
    this.userService.followings.forEach(user => {
      this.userService.getProfilePic(user._id)?.subscribe(url => user.profile_pic = url);
      this.following.push(user);
    });
    this.userService.followers.forEach(user => {
      this.userService.getProfilePic(user._id)?.subscribe(url => user.profile_pic = url);
      this.followers.push(user);
    });
  }

  ngOnInit(): void {
  }

  follow(userId: string){
    try{
      this.userService.follow(userId);
      const index = this.activeArray.findIndex(user => user._id === userId);
      this.following.push(this.activeArray[index]);
    } catch (err) { console.log(err) }
  }

  unfollow(userId: string){
    try{
      this.userService.unfollow(userId);
      const index = this.following.findIndex(user => user._id === userId);
      this.following.splice(index, 1);
      if(this.activeArray === this.following){
        this.activeArray = this.following;
      }
    } catch (err) { console.log(err) }
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
      if (result.isConfirmed) {
        this.userService.pardon(userId);
      }
    })
  }

}
