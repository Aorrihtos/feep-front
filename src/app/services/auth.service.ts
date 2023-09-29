import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  register(data: any){
    return this.http.post(`${this.baseUrl}/user/register`, data)
      .pipe(
        tap((res: any) => {
          if(res.status === "success"){
            localStorage.setItem("user", JSON.stringify(res.user));
            localStorage.setItem("token", JSON.stringify(res.token));
          }
        })
      );
  }
  login(data: any){
    return this.http.post(`${this.baseUrl}/user/login`, data)
      .pipe(
        tap((res: any) => {
          if(res.status && res.status === "success"){
            console.log("patata")
            localStorage.setItem("user", JSON.stringify(res.user));
            localStorage.setItem("token", JSON.stringify(res.token));
          }
        })
      );
  }
}
