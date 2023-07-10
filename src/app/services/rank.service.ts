import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class RankService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  rank(){
    return this.http.get(`${this.baseUrl}/rank/get`);
  }

}
