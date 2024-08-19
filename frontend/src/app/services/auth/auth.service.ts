import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {User} from "../../interfaces/user";
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  baseUrl:string = environment.baseUrl

  register(data:any):Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data, {headers: {
        // 'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
      }})
  }

  login(data:any):Observable<any> {
    this.removeToken()
    this.removeUserData()
    return this.http.post(`${this.baseUrl}/auth/login`, data)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isExpired() {
    const token:any = this.getToken();
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    console.log('expiry of token', expiry);

    return (Math.floor((new Date).getTime() / 1000)) >= expiry;

  }

  isAuthenticated() {
    const token = this.getToken();
    // Check if token is present and not expired

    if (token === null || token === '')
      return false;
    else
      return true;
  }

  removeToken() {
    localStorage.removeItem('token')
  }

  storeToken(token:string) {
    localStorage.setItem('token', token);
  }

  removeUserData() {
    localStorage.removeItem('user')
  }

  storeUserData(user:User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  validateToken(token:string) {
    try {
      const decodedToken:any = jwtDecode(token);
      if (!decodedToken.exp) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (err) {
      console.error('invalid token', err)
      return false
    }
  }

  logOut() {
    this.removeUserData()
    this.removeToken()
  }
}
