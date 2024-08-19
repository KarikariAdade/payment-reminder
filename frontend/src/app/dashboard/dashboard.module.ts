import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { TaxComponent } from './components/tax/tax.component';
import {NzBreadCrumbComponent, NzBreadCrumbItemComponent} from "ng-zorro-antd/breadcrumb";
import { BreadcrumbComponent } from '../reusables/breadcrumb/breadcrumb.component';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzInputDirective} from "ng-zorro-antd/input";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [

    TaxComponent,
      BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    NzCardComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzInputDirective,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DashboardModule { }
