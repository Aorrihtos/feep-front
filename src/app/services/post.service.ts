import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  _likedPosts: Array<string> = [];

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {
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

  sendComment(content: string, idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/comment/send/${idPost}`,{content: content} , {headers});
  }

  delComment(idComment: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.delete(`${this.baseUrl}/comment/remove/${idComment}` , {headers});
  }

  like(idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/like/add/${idPost}`,null , {headers});
  }

  unlike(idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.delete(`${this.baseUrl}/like/unlike/${idPost}` , {headers});
  }

  delete(idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.delete(`${this.baseUrl}/post/remove/${idPost}` , {headers});
  }

  getImage(idPost: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.get(`${this.baseUrl}/post/image/${idPost}` , {headers, responseType: "arraybuffer"})
      .pipe(
        map(res => {
          let blob = new Blob([res]);
          return window.URL.createObjectURL(blob);
        })
      );
  }

  getUserCredentials(){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);
    return [token, user];
  }
}
