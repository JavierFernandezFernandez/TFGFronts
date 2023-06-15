import { EmpleadoService } from 'src/app/services/empleado/empleado.service';
import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/Empleado.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  empleado:Empleado = {} as Empleado

  constructor(private empleadoservice: EmpleadoService, private router:Router) { }

  ngOnInit() {
    this.getUserByEmail()
  }

  getUserByEmail(){

    if (localStorage.getItem('email')) {
      this.empleadoservice.getEmpleadoByEmail(localStorage.getItem('email') as string)
        .subscribe((response:Empleado) => {
          if (response) {
            this.empleado = response
          }
        })
    }

  }

  closeSesion() {
    localStorage.clear();
    this.router.navigate(['/']);
    location.reload()
  }

  pedidos() {
    this.router.navigate(['page/pedido'])
  }
  pedidosOnline() {
    this.router.navigate(['page/pedidoOnline'])
  }

  productos() {
    this.router.navigate(['page/inicio'])
  }

}
