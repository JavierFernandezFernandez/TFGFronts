import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from './../../services/search/search.service';
import { Producto } from 'src/app/models/Producto';
import { ProductoService } from '../../services/producto/producto.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, catchError, debounceTime } from 'rxjs';
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


  addProdcuctName: string = '';

  addCartSuccess: boolean = false;

  private _success = new Subject<string>();

  staticAlertClosed = true;
  successMessage = '';

  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert = {} as NgbAlert;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert = {} as NgbAlert;

  constructor(
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private ejemplarService: EjemplarService,
    private searchService: SearchService,
    private router:Router
  ) {
    const arrHref = location.href.split('/');
    this.term = arrHref[arrHref.length - 1];
  }

  ngOnInit(): void {
    this.searchService.setSearchTerm(this.term)
    this.productoService.getProductByName(this.term)
      .subscribe((response: Producto[]) => {
        this.products = response
        for (const product of this.products) {
          this.countStok(product)
        }
      })
      this._success.subscribe((message) => (this.successMessage = message));
      this._success.pipe(debounceTime(10000)).subscribe(() => {
        if (this.selfClosingAlert) {
          this.selfClosingAlert.close();
        }
      });
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
  public changeSuccessMessage() {
    this._success.next(`${new Date()} - Message successfully changed.`);
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
