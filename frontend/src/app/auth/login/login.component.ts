import { Component } from '@angular/core';
import {ConfigService} from "../../services/config.service";
import {AuthService} from "../../services/auth/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
  }

  hasError = false

  errorMessage: string = ''

  errorType: string = ''

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  submitLoginForm() {
    const data = this.loginForm.value

    this.authService.login(data).subscribe({
      next: (response) => {
        if (response.status === 200) {

          const validToken: boolean = this.authService.validateToken(response.data.token)

          if (validToken) {

            this.authService.storeToken(response.data.token)
            this.authService.storeUserData(response.data.user)

            this.router.navigate(['/dashboard']).then(() => {
              this.message.create('success', `Welcome back, ${response.data.user.name}`)
            })

          }
          console.log('login response', response)

        }
        console.log('login response', response)
      },
      error: (errors) => {
        this.hasError = true
        this.errorType = 'error'
        this.errorMessage = this.config.generateErrorMessage(errors)

      }
    })


  }
}
