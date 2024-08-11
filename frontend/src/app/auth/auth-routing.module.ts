import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AuthComponent} from "./auth.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

const routes: Routes = [
  {
    path:'',
    component: AuthComponent,
    children: [
      {path: '', component: LoginComponent},
      {path:'login', component: LoginComponent},
      {path:'register', component: RegisterComponent},
      {path:'password/reset', component: ResetPasswordComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
