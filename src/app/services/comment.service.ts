import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  _likedComments: Array<string> = [];

  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
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

  like(commentId: string){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    this.http.post(`${this.baseUrl}/like/add/comment/${commentId}`,null, {headers}).subscribe(
      (res: any) => {this._likedComments.push(commentId)}
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
