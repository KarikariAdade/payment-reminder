import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core/testing";
import {ConfigService} from "../services/config.service";
import {Injectable} from "@angular/core";
import {finalize, Observable} from "rxjs";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private config: ConfigService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.config.showLoadingScreen()
    console.log('this is good')
    return next.handle(req).pipe(

      finalize(() => this.config.hideLoadingScreen())
    );

  }

}
