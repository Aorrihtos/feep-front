import { Component } from '@angular/core';
import Swal from "sweetalert2";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  results: Array<any> = [];
  data!: string;
  pagination: any;
  isLoading: boolean = false;

  constructor(public userService: UserService, private aRouter: ActivatedRoute, private router: Router) {
    this.aRouter.queryParams.subscribe(res => {
      this.data = res['user'];
      if(this.data){
        this.isLoading = true;
        this.initData(this.data);
      }
    });
  }

  follow(userId: string, event: Event){
    try{
      this.userService.follow(userId);
      event.stopPropagation();
    } catch (err) { console.log(err) }
  }

  unfollow(userId: string, event: Event){
    try{
      this.userService.unfollow(userId);
      event.stopPropagation();
    } catch (err) { console.log(err) }
  }

  block(userId: string, event: Event){
    event.stopPropagation();
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

  pardon(userId: string, event: Event){
    event.stopPropagation();
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

  loadNext(){
    console.log(this.pagination)
    if(this.pagination.page < this.pagination.total_pages){
      this.userService.search(this.data, ++this.pagination.page)?.subscribe((res: any) => {
        this.results = this.results.concat(res.users);
        this.pagination = res.pagination;
      })
    }
  }

  visit(idUser: string){
    this.router.navigate(['/feed'], {queryParams: {id: idUser}})
      .then(res => window.location.reload());
  }

  changeData(data: string){
    this.isLoading = true;
    this.initData(data);
  }

  initData(data: string){
    this.userService.search(data)?.subscribe((res: any) => {
      this.results = res.users;
      this.pagination = res.pagination;
      this.isLoading = false;
    });
  }

}
