import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getNotifications(page: number = 1){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    const params = new HttpParams().set("page", page);
    return this.http.get(`${this.baseUrl}/user/notifications`, {headers, params});
  }

  markAsReaded(id: string = ""){
    const [token] = this.getUserCredentials();
    if(!token) return;
    const headers = new HttpHeaders().set("Authorization", token);
    return this.http.patch(`${this.baseUrl}/notifications/read/${id}`, null,{headers})
      .subscribe();
  }

  getUserCredentials(){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')!);
    return [token, user];
  }

}
