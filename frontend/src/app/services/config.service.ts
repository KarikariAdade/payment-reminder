import { Injectable } from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private authService: AuthService
  ) { }

  private loadingScreenSubject = new BehaviorSubject<any>(false);

  loading = this.loadingScreenSubject.asObservable();

  showLoadingScreen() {
    this.loadingScreenSubject.next(true);
  }

  hideLoadingScreen() {
    this.loadingScreenSubject.next(false);
  }

  generateHeader () {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    }
  }

  generateErrorMessage (error:any) {

    if (error.error.data && error.error.data.length > 0) {
      return error.error.data[0].msg
    }else{
      return error.error.message;
    }

  }
}
