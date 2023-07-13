import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {map} from "rxjs";
import Swal from "sweetalert2";
@Injectable({
  providedIn: 'root'
})
export class UserService{

  baseUrl = environment.baseUrl;
  _followings: Map<string, any> = new Map();
  _blocks: Map<string, any> = new Map();
  constructor(private http: HttpClient) {
    this.initalize()
  }

  get followings(){
    return this._followings;
  }

  get blocks(){
    return this._blocks;
}

  detail(userId: string | null = null){
    const [token, user] = this.getUserCredentials();
    if(!token) return;
    const param = userId ? userId : '';
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/user/detail/${param}`, null,{headers});
  }

  description(data: any){
    const [token, user] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/user/description`, data,{headers});
  }

  getProfilePic(userId: string | null = null){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const param = userId ? userId : '';
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.get(
      `${this.baseUrl}/user/profile-pic/${param}`,
      {headers, responseType: "arraybuffer"}
    ).pipe(
      map(res => {
        let blob = new Blob([res]);
        return window.URL.createObjectURL(blob);
      })
    )
  }

  feed(){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.get(`${this.baseUrl}/user/feed`, {headers});
  }

  posts(userId: string | null = null, page: number = 1){
    const [token, user] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    const params = new HttpParams().set("page", page);
    if(!userId) userId = user._id;
    return this.http.get(`${this.baseUrl}/user/${userId}/posts`, {headers, params});
  }

  follow(userId: string){
    const[token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/follow/add/${userId}`, null, {headers})
      .subscribe((res: any) => {
        this._followings.set(userId, res.follow.followed_id)
        console.log(this.followings)
      });
  }

  unfollow(userId: string){
    const[token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.delete(`${this.baseUrl}/follow/unfollow/${userId}`, {headers}).subscribe(
      (res: any) => {
        this._followings.delete(userId);
      }
    );
  }

  block(userId: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/block/add/${userId}`, null, {headers})
      .subscribe((res: any) => {
        this._blocks.set(userId, {
          blocked_id: res.block.blocked_id,
          points: res.block.blocked_id.points,
          followers: res.block.blocked_id.followers
        });
        this._followings.delete(userId);
      });
  }

  pardon(userId: string){
    const[token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be able to see his posts and comments again',
      showDenyButton: true,
      confirmButtonText: 'Unblock',
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        return this.http.delete(`${this.baseUrl}/block/pardon/${userId}`, {headers})
          .subscribe(
          (res: any) => {
            this._blocks.delete(userId);
            return true;
          }
        );
        //this._blocks = this._blocks.filter(item => item.blocked_id._id !== userId);
      } else return false;
    })
  }

  uploadImg(file: File){
    const[token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    const formData = new FormData();
    formData.append('file0', file);
    return this.http.post(`${this.baseUrl}/user/upload`,formData, {headers});
  }

  update(data: any){
    const[token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.put(`${this.baseUrl}/user/update`, data, {headers})
  }

  getUserCredentials(){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);
    return [token, user];
  }

  initalize(){
    console.log("ENTRO AQUí")
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    this.http.get(`${this.baseUrl}/user/following`, {headers}).subscribe(
      (res: any) =>{
        res.following.forEach((item: any) =>{
          this._followings.set(item._id, item);
        });
        console.log(this._followings)
      }
    );
    this.http.get(`${this.baseUrl}/user/blocks`, {headers}).subscribe(
      (res: any) =>{
        res.blocked.forEach((item: any) =>{
          this._blocks.set(item.blocked_id._id, item);
        });
        console.log(this._blocks)
      }
    );
  }
}
