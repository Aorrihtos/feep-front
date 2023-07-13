import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  publish(post: any){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.post(`${this.baseUrl}/post/upload`, post, {headers});
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

  getUserCredentials(){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);
    return [token, user];
  }
}
