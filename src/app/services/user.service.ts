import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {map} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

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
    console.log(userId);
  }

  block(userId: string){
    console.log(userId);
  }
  getUserCredentials(){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);
    return [token, user];
  }
}
