import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {WebsocketsService} from "./websockets.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  _likedComments: Array<string> = [];

  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient, private socketService: WebsocketsService) {
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    this.http.get(`${this.baseUrl}/user/liked-comments`, {headers}).subscribe(
      (res: any) => this._likedComments = res.liked_comments
    );
  }

  get liked_comments(){
    return this._likedComments;
  }

  like(comment: any){
    const [token, user] = this.getUserCredentials();
    if(!token || !user) return;
    const commentId = comment._id;
    const snd = new Audio("../../assets/sfx/like.wav");
    snd.play().then(r => snd.currentTime=0);
    const headers = new HttpHeaders().set("Authorization", token);
    this.http.post(`${this.baseUrl}/like/add/comment/${commentId}`,null, {headers}).subscribe(
      (res: any) => {
        this._likedComments.push(commentId);
        this.socketService.emitEvent("likedComment", {
          loggedId: user._id,
          title: `${user.username} liked your comment!`,
          loggedUsername: user.username,
          userProfilePic: user.profile_pic,
          destinyUser: comment.user_id._id,
          idComment: comment._id,
          content: comment.content,
          link: `http://localhost:4200/feed?post=${commentId.post_id}`,
          created_at: Date.now()
        });
      }
    )
  }

  unlike(commentId: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    this.http.delete(`${this.baseUrl}/like/unlike/comment/${commentId}`, {headers}).subscribe(
      (res: any) => {
        const index = this._likedComments.indexOf(commentId);
        this._likedComments.splice(index, 1);
      }
    )
  }

  getUserCredentials(){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);
    return [token, user];
  }

}
