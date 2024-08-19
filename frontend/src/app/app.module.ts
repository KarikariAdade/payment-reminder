import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {NzGridModule} from "ng-zorro-antd/grid";
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from "ng-zorro-antd/menu";
import { DashboardComponent } from './dashboard/dashboard.component';
import {LoadingInterceptor} from "./interceptors/loading.interceptor";
import {
  NgxUiLoaderConfig, NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
  PB_DIRECTION,
  POSITION,
  SPINNER
} from "ngx-ui-loader";
import {NzAlertComponent} from "ng-zorro-antd/alert";
import {AuthModule} from "./auth/auth.module";
import { TaxComponent } from './dashboard/components/tax/tax.component';

registerLocaleData(en);

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "blue",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.squareJellyBox, // background spinner type
  fgsType: SPINNER.squareJellyBox, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    TaxComponent
  ],
  imports: [
    BrowserModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule,
    AppRoutingModule,
    FormsModule,
    NzGridModule,
    NzContentComponent,
    NzHeaderComponent,
    NzIconDirective,
    NzLayoutComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSiderComponent,
    NzSubMenuComponent,
    NzAlertComponent,
    AuthModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
