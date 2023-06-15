import { Producto } from 'src/app/models/Producto';
import { ProductoService } from '../../services/producto/producto.service';
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Router } from '@angular/router';
import { EjemplarService } from 'src/app/services/ejemplar/ejemplar.service';
import { Ejemplar } from 'src/app/models/Ejemplar';

@Component({
  selector: 'app-searched-products',
  templateUrl: './searched-products.component.html',
  styleUrls: ['./searched-products.component.scss']
})
export class SearchedProductsComponent implements OnInit {
  term: string;
  products: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private ejemplarService: EjemplarService,
    private router:Router
  ) {
    const arrHref = location.href.split('/');
    this.term = arrHref[arrHref.length - 1];
  }

  ngOnInit(): void {
    this.productoService.getProductByName(this.term)
      .subscribe((response: Producto[]) => {
        this.products = response
        for (const product of this.products) {
          this.countStok(product)
        }
      })
  }
  checkDescriptionQuantity(product: Producto): boolean {
    if (product.descripcion) {
      if (product.descripcion.length > 297) {
        return true;
      }
    }
    return false;
  }
  addToCart(product:Producto) {
    if (localStorage.getItem("token") && localStorage.getItem("email")) {
      this.usuarioService.getUserByEmail(localStorage.getItem("email") as string)
        .subscribe((response: Usuario) => {
          if (response.cesta != null || response.cesta != undefined) {
            if (response.cesta == '') {
              response.cesta = '[]';
            }
            let cart: Producto[] = JSON.parse(response.cesta);
            const productIndex: number = cart.findIndex((p: Producto) => p.id == product.id)
            if (productIndex == -1) {
              cart.push(product);
            } else {
              if (cart[productIndex].quantity) {
                (cart[productIndex].quantity as number) += product.quantity ? product.quantity : 0;
              }
            }
            response.cesta = JSON.stringify(cart);
            const user: Usuario = { cesta: response.cesta } as Usuario
            this.usuarioService.updateUser(response.id as number, user)
              .pipe(catchError((err) => {
                return err.messaje
              }))
              .subscribe((response: Usuario | string) => {
                if (!(typeof response === 'string')) {
                  product.addCartSuccess = true;
                }
              });
          }
        })
    } else {
      this.router.navigate(['auth/login']);
    }

  }
  private countStok(product: Producto) {
    this.ejemplarService.getUnitsByProductId(product.id)
      .subscribe((response: Ejemplar[]) => {
        product.units = response;
        if (product.units.length == 0) {
          product.quantity = 0
        } else {
          product.quantity = 1
        }
      })
  }
}
