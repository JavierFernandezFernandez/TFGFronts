import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RespuestaLogin } from 'src/app/models/RespuestaLogin';
import { catchError } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { LayoutService } from 'src/app/services/layout/layout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailOrPasswordIncorrect: boolean = false;

  form = this.formB.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(45),
    ]],
    password: ['', [
      Validators.required,
      Validators.maxLength(255),
    ]],
  });

  constructor(
    private usuarioService: UsuarioService,
    private formB: FormBuilder,
    private router: Router,
    private layoutService: LayoutService
  ) { }
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/'])
    }
  }
  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }
  login(event: SubmitEvent) {
    if (this.form.valid) {
      this.usuarioService.login(this.email.value, this.password.value)
        .pipe(catchError(error => {
          return error.message
        }))
        .subscribe(
          (response: RespuestaLogin | string) => {
            if (!(typeof response === 'string')) {
              this.emailOrPasswordIncorrect = false;
              const token = response.body.Authorization;
              localStorage.setItem('token', token);
              localStorage.setItem('email', this.email.value);
              this.layoutService.setLoggedIn(true);
              this.router.navigate(['/']);
            } else {
              this.emailOrPasswordIncorrect = true;
              console.log('Email o contraseña incorrectos');
            }
          });
    } else {
      event.preventDefault()
    }
  }
}
