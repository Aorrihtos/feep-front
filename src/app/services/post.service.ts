import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {map, tap} from "rxjs";
import {WebsocketsService} from "./websockets.service";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  _likedPosts: Array<string> = [];

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private socketService: WebsocketsService) {
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    this.http.get(`${this.baseUrl}/user/liked-posts`, {headers}).subscribe(
      (res: any) => this._likedPosts = res.liked_posts
    );
  }

  get liked_posts(){
    return this._likedPosts;
  }

  publish(post: string, img: File | null = null){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    const formData = new FormData();
    formData.append('content', post);
    if(img) {
      formData.append('file0', img)
    }
    return this.http.post(`${this.baseUrl}/post/upload`, formData, {headers});
  }

  detail(idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.get(`${this.baseUrl}/post/detail/${idPost}`, {headers});
  }

  sendComment(content: string, post: any){
    const [token, user] = this.getUserCredentials();
    if(!token || !user) return;
    const idPost = post.idPost;
    console.log(post);
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/comment/send/${idPost}`,{content: content} , {headers}).pipe(
      tap( (res: any)=>{
        this.socketService.emitEvent("sendComment",{
          loggedId: user._id,
          title: `${user.username} has sent you a comment!`,
          text: content,
          loggedUsername: user.username,
          userProfilePic: user.profile_pic,
          destinyUser: post.idUser,
          idPost,
          idComment: res.comment._id,
          contentPost: post.content,
          attached_file: post.attached_file,
          link: `http://localhost:4200/feed?post=${idPost}`,
          created_at: Date.now()
        })
      })
    );
  }

  delComment(comment: any){
    const [token, user] = this.getUserCredentials();
    if(!token || !user) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.delete(`${this.baseUrl}/comment/remove/${comment._id}` , {headers})
      .pipe(
        tap(()=>{
          this.socketService.emitEvent("deletedComment", {
            loggedId: user._id,
            idPost: comment.post_id,
            idComment: comment._id
          });
        })
      );
  }

  snd = new Audio("../../assets/sfx/like.wav");
  like(post: any){
    const [token, user] = this.getUserCredentials();
    if(!token || !user) return;
    const idPost = post._id;
    this.snd.play().then(r => this.snd.currentTime=0);
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/like/add/post/${idPost}`,null , {headers}).pipe(
      tap(
        ()=> this.socketService.emitEvent("likedPost", {
          loggedId: user._id,
          title: `${user.username} liked your post!`,
          text: post.content,
          loggedUsername: user.username,
          userProfilePic: user.profile_pic,
          destinyUser: post.user_id._id,
          idPost,
          attached_file: post.attached_file,
          link: `http://localhost:4200/feed?post=${idPost}`,
          created_at: Date.now()
        })
      )
    );
  }

  unlike(idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.delete(`${this.baseUrl}/like/unlike/post/${idPost}` , {headers});
  }

  delete(idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.delete(`${this.baseUrl}/post/remove/${idPost}` , {headers});
  }

  getComments(idPost: string, page: number = 1){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    const params = new HttpParams().set("page", page);
    return this.http.get(`${this.baseUrl}/post/comments/${idPost}` , {headers, params});
  }

  getUserCredentials(){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);
    return [token, user];
  }
}
