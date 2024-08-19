import { Component } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
  }


  logOut() {
    this.authService.logOut()
    this.router.navigate(['/auth/login']).then(() => {
      this.message.success('You have been logged out')
    })
  }

}
