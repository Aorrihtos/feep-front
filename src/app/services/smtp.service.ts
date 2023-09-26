import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SmtpService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  send(data: any){
    const token = localStorage.getItem("token");
    if(!token) return;
    const user: any = JSON.parse(localStorage.getItem("user")!);
    data.email = user.email;
    const headers = new HttpHeaders().set("Authorization", JSON.parse(token));
    return this.http.post(`${this.baseUrl}/user/contact`, data, {headers});
  }

}
