import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromEvent, merge } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  form:FormGroup = this.formB.group({
    name: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(45),
    ]],
    phone: ['', [
      Validators.required,
      Validators.pattern(/^[6-9]\d{8}$/),
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(45),
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(255),
    ]],
    confirmPassword: ['', [
      Validators.required,
    ]],
  });

  equalsPassword: boolean = true;

  constructor(private usuarioService: UsuarioService, private router: Router, private formB: FormBuilder) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')){
      this.router.navigate(['/'])
    }
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get phone(): FormControl {
    return this.form.get('phone') as FormControl;
  }
  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }
  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  register(event: SubmitEvent) {
    if (this.form.valid) {
      if (this.password.value === this.confirmPassword.value) {
        this.equalsPassword = true;
        console.log(
          `${this.name.value}\n${this.phone.value}\n${this.email.value}\n${this.password.value}\n${this.confirmPassword.value}`
        );
        this.
          usuarioService.saveUser(
            this.name.value,
            this.phone.value,
            this.email.value,
            this.password.value,
            6
          )
          .subscribe((response) => {
            console.log(response);
            this.router.navigate(['/auth/login']);
          });
      } else {
        this.equalsPassword = false;
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  }
}
