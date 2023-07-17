import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {

  }


}
