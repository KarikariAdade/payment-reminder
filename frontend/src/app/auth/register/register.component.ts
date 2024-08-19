import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {passwordMatchValidator} from "../../config/PasswordConfirmation";
import {ConfigService} from "../../services/config.service";
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private config: ConfigService,
    private message: NzMessageService
  ) {
  }

  hasError = false

  errorMessage: string = ''

  errorType: string = ''

  registrationForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  }, {
    validators: [passwordMatchValidator('password', 'confirmPassword')]
  })

  ngOnInit(): void {

  }

  register() {
    this.authService.register(this.registrationForm.value).subscribe({
      next: (response) => {
        if (response.status === 200){
          this.router.navigate(['/auth/login']).then(() => {
            this.message.create('success', 'Registration successful. Kindly log in.')
          })
        }else{
          this.message.create('error', 'Registration failed. Please try again.')
        }
      },
      error: (err) => {
        this.hasError = true
        this.errorType = 'error'
        this.errorMessage = this.config.generateErrorMessage(err)
      }
    })
  }



}
