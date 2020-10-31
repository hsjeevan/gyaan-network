import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from '../passwordValidator';
import { AuthService } from '../auth.service';
import { UiService } from 'src/app/services/shared/ui.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiService) { }

  registrationForm = this.fb.group({
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    // terms: [true, Validators.requiredTrue],
    role: ['student', Validators.required],
    confirmPassword: ['', Validators.required]
  }, { validator: PasswordValidator });

  ngOnInit(): void {
  }

  register() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
      this.uiService.showSnackbar(JSON.stringify(this.registrationForm.value), null, 3000);
      this.authService.registerUser(this.registrationForm.value);
    }
    else {
      // console.log("Invalid Data");
    }
  }

  googleLogin() {
    this.authService.webGoogleLogin();
  }


}
