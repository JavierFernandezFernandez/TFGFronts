import { EjemplarService } from 'src/app/services/ejemplar/ejemplar.service';
import { ProductoService } from 'src/app/services/producto/producto.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Producto } from 'src/app/models/Producto';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { Ejemplar } from 'src/app/models/Ejemplar';

@Component({
  selector: 'app-shopping-basket',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  idUser: number = 0;
  cart: Producto[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private ejemplarService: EjemplarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") && localStorage.getItem("email")) {
      this.usuarioService.getUserByEmail(localStorage.getItem("email") as string)
        .subscribe((response: Usuario) => {
          this.idUser = response.id
          this.cart = JSON.parse(response.cesta as string);
          for (const product of this.cart) {
            if (!product.quantity) {
              product.quantity = 1
            }
          }
        })
    }
  }
  priceWithIva(product: Producto): number {
    return this.productoService.getPriceWithIva(product)
  }

  lessQuantity(input: HTMLInputElement, product: Producto) {
    if (Number(input.value) > 1) {
      input.value = String(Number(input.value) - 1);
      product.quantity = Number(input.value);
      this.saveCart();
    }
  }
  moreQuantity(input: HTMLInputElement, product: Producto) {
    this.ejemplarService.getUnitsByProductId(product.id)
      .subscribe((response: Ejemplar[]) => {
        if (response.length > Number(input.value)) {
          input.value = String(Number(input.value) + 1);
          product.quantity = Number(input.value);
          this.saveCart();
        }
      })


  }
  totalPrice() {
    let totalPrice: number = 0;
    for (const product of this.cart) {
      if (product?.quantity) {
        totalPrice += this.priceWithIva(product) * product?.quantity;
      } else {
        totalPrice += this.priceWithIva(product)
      }
    }
    return totalPrice.toFixed(2)
  }

  removeProduct(product: Producto) {
    const index = this.cart.findIndex((p: Producto) => p.id === product.id)
    if (index !== -1) {
      // console.log(this.cart[index])
      this.cart.splice(index, 1);
      this.saveCart()
    }
  }

  confirmOrder() {
    const user: Usuario = { cesta: JSON.stringify(this.cart) } as Usuario;

    this.usuarioService.updateUser(this.idUser, user)
      .pipe(catchError((error) => {
        return error.message
      }))
      .subscribe((response: Usuario | string) => {
        if (!(typeof response === 'string')) {
          this.router.navigate(['process-oreder'])
        } else {
          console.log(response)
        }
      })
  }
  private saveCart() {
    const user: Usuario = { cesta: JSON.stringify(this.cart) } as Usuario;

    this.usuarioService.updateUser(this.idUser, user)
      .pipe(catchError((error) => {
        return error.message
      }))
      .subscribe((response: Usuario | string) => {
        if (typeof response === 'string') {
          console.log(response)
        }
      })

  }
}
