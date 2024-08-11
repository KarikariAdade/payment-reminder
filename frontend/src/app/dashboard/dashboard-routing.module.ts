import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "../app.component";
import {DashboardComponent} from "./dashboard.component";
import {TaxComponent} from "./components/tax/tax.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: 'taxes', component: TaxComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
