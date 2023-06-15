import { CategoriaService } from './../../services/categoria/categoria.service';
import { Categoria } from '../../models/Producto';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout/layout.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  delay: boolean = false;
  name: string = '';
  categories: Categoria[] = [];
  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.layoutService.isLoggedIn
    .subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.getName()
    this.getCategories()
  }
  closeSesion() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
    location.reload()
  }

  getAcutualRoute(): string {
    return this.router.url
  }

  search(therm: HTMLInputElement) {
    therm.value.trim();
    if (therm.value != '') {
      this.router.navigate([`/search/${therm.value}`]);
    }
  }
  private getName() {
    if (localStorage.getItem('email')) {
      this.usuarioService.getUserByEmail(localStorage.getItem('email') as string)
        .subscribe((response: Usuario) => {
          this.name = response.nombre as string;
        })
    }
  }
  private getCategories(){
    this.categoriaService.getCategories()
      .subscribe((response: Categoria[]) => {
        this.categories = response
      })
  }
}
