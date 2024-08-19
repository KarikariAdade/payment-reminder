import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from "./alert/alert.component";
import {NzAlertComponent} from "ng-zorro-antd/alert";



@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    CommonModule,
    NzAlertComponent,
  ],
  exports: [
    AlertComponent
  ]
})
export class SharedModule { }
