import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.css']
})
export class BlockedComponent {

  blocks: Array<any> = [];

  constructor(private userService: UserService) {
    this.userService.blocks.forEach(user => {
      this.blocks.push(user);
    });
    this.blocks.forEach((user, index) => {
      console.log(user);
      this.userService.getProfilePic(user.blocked_id._id)?.subscribe(
        url => this.blocks[index].image_url = url
      );
    })
  }

  unblock(userId: string){
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will be able to see his posts and comments again',
    //   showDenyButton: true,
    //   confirmButtonText: 'Unblock',
    //   denyButtonText: `Cancel`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     this.userService.pardon(userId);
    //     this.blocks = this.blocks.filter(item => item.blocked_id._id !== userId);
    //   }
    // })
    const res = this.userService.pardon(userId);
    console.log(res);
  }

}
