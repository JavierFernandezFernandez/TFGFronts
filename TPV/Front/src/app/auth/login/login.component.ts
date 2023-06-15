import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseLogin } from 'src/app/models/ResponseLogin';
import { EmpleadoService } from 'src/app/services/empleado/empleado.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  typeImputPassword:string = 'password';

  emailOrPasswordIncorrect:boolean = false
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
    password: ['', [Validators.required, Validators.maxLength(255)]]
  })

  constructor(private formBuilder: FormBuilder, private empleadoService:EmpleadoService, private router:Router) { }

  login(event:Event){
    this.empleadoService.login(this.email.value, this.password.value)
    .subscribe((response:ResponseLogin) => {
      localStorage.setItem("token", response.Authorization);
      localStorage.setItem("email", this.email.value);
      this.router.navigate(['page/inicio']);
    })
  }

  changeTypePassword(imput:HTMLInputElement){

    if(imput.checked){
      this.typeImputPassword = 'text';
    }else{
      this.typeImputPassword = 'password';
    }

  }

  get email(){
    return this.form.get('email') as FormControl;
  }

  get password(){
    return this.form.get('password') as FormControl;
  }

}
