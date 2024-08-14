import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }

  baseUrl:string = environment.baseUrl

  register(data:any):Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data)
  }
}
